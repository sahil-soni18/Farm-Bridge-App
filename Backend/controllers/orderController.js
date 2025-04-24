import Order from "../models/Orders.js";
import OrderItem from "../models/OrderItem.js";
import Product from "../models/Product.js";
import sequelize from "../db/db.js";





export const createOrder = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { userId } = req.user;
    const { items, total_price } = req.body;

    console.log(`req.body: ${JSON.stringify(req.body)}, ${userId}`)


    // Validate stock and prepare order items
    const orderItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findByPk(item.product_id, { transaction });

        if (!product) {
          throw new Error(`Product not found: ${item.product_id}`);
        }

        if (product.quantity < item.quantity) {
          throw new Error(`Insufficient stock for product: ${product.name}`);
        }

   

        // Decrement stock for the product
        await product.decrement("quantity", {
          by: item.quantity,
          transaction,
        });

        return {
          order_id: null, // Will be updated after order creation
          product_id: item.product_id,
          name: product.name, // Include product name
          quantity: item.quantity,
          price: item.price,
        };
      })
    );

    // Create the order
    const order = await Order.create({ userId, total_price }, { transaction });

    // Associate order items with the order
    orderItems.forEach((item) => {

      item.order_id = order._id;
    });

    await OrderItem.bulkCreate(orderItems, { transaction });

    await transaction.commit();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
      items: orderItems,
    });
  } catch (error) {
    await transaction.rollback();

    res.status(500).json({
      success: false,
      message: "Error creating order",
      error: error.message,
    });
  }
};


// Get All Order by User Id

export const getOrderById = async (req, res) => {
  const { userId } = req.user;

  try {
    const orders = await Order.findAll({
      where: { userId },
      include: [{ model: OrderItem, as: 'items' }], // Assuming association is defined
    });

    if (!orders.length) {
      return res.status(404).json({ message: "No orders found for this user." });
    }

    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: error.message || "Something went wrong!" });
  }
};


// Get All Order For Admin

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [{ model: OrderItem, as: 'items' }],
    });

    if (!orders.length) {
      return res.status(404).json({ message: "No orders found." });
    }

    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: error.message || "Something went wrong!" });
  }
};


// Update order status
// Store active status update intervals
const statusUpdateIntervals = new Map();

// Function to simulate automatic status progression
const simulateStatusUpdate = async (orderId) => {
  const order = await Order.findByPk(orderId);
  if (!order) {
    clearInterval(statusUpdateIntervals.get(orderId));
    statusUpdateIntervals.delete(orderId);
    return;
  }

  const statusSequence = ["ordered", "shipped", "out_for_delivery", "delivered"];
  const currentIndex = statusSequence.indexOf(order.status);
  
  if (currentIndex < statusSequence.length - 1) {
    order.status = statusSequence[currentIndex + 1];
    await order.save();
  } else if (order.status === "delivered") {
    // Stop updates when order is delivered
    clearInterval(statusUpdateIntervals.get(orderId));
    statusUpdateIntervals.delete(orderId);
  }
};

// Update order status (manual or automatic)
export const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status, enableAutoUpdates = false } = req.body;

  const validStatuses = [
    "ordered", 
    "shipped", 
    "out_for_delivery", 
    "delivered", 
    "returned",
    "cancelled"
  ];
  
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ 
      message: "Invalid status provided.",
      validStatuses
    });
  }

  try {
    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    // Manual status update
    if (status) {
      // Special case for returns - can only be done from delivered status
      if (status === "returned" && order.status !== "delivered") {
        return res.status(400).json({ 
          message: "Only delivered orders can be returned." 
        });
      }

      order.status = status;
      await order.save();
      
      // If order is cancelled or returned, stop auto updates
      if (["cancelled", "returned"].includes(status) && 
          statusUpdateIntervals.has(orderId)) {
        clearInterval(statusUpdateIntervals.get(orderId));
        statusUpdateIntervals.delete(orderId);
      }
    }

    // Handle automatic updates
    if (enableAutoUpdates && !statusUpdateIntervals.has(orderId) && 
        !["cancelled", "returned", "delivered"].includes(order.status)) {
      // Start automatic updates every 10 seconds
      const interval = setInterval(() => {
        simulateStatusUpdate(orderId);
      }, 10000);
      
      statusUpdateIntervals.set(orderId, interval);
    } else if (!enableAutoUpdates && statusUpdateIntervals.has(orderId)) {
      // Stop automatic updates
      clearInterval(statusUpdateIntervals.get(orderId));
      statusUpdateIntervals.delete(orderId);
    }

    res.json({
      success: true,
      message: "Order status updated successfully.",
      order,
      autoUpdatesEnabled: statusUpdateIntervals.has(orderId)
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Something went wrong!" });
  }
};

// Get order status
export const getOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  
  try {
    const order = await Order.findByPk(orderId);
    
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }
    
    res.json({
      success: true,
      status: order.status,
      autoUpdatesEnabled: statusUpdateIntervals.has(orderId),
      lastUpdated: order.updatedAt,
      canReturn: order.status === "delivered" && order.status !== "returned"
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Something went wrong!" });
  }
};

// Initiate return
export const initiateReturn = async (req, res) => {
  const { orderId } = req.params;
  const { reason } = req.body;

  try {
    const order = await Order.findByPk(orderId);
    
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    if (order.status !== "delivered") {
      return res.status(400).json({ 
        message: "Only delivered orders can be returned." 
      });
    }

    if (order.status === "returned") {
      return res.status(400).json({ 
        message: "This order has already been returned." 
      });
    }

    // Update status to returned
    order.status = "returned";
    order.returnReason = reason;
    await order.save();

    // Stop any automatic updates
    if (statusUpdateIntervals.has(orderId)) {
      clearInterval(statusUpdateIntervals.get(orderId));
      statusUpdateIntervals.delete(orderId);
    }

    res.json({
      success: true,
      message: "Return initiated successfully.",
      order
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Something went wrong!" });
  }
};


// Delete Order

export const deleteOrder = async (req, res) => {
  const { userId } = req.user;
  const { orderId } = req.params;

  try {
    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    if (order.userId !== userId) {
      return res.status(403).json({ message: "Only the order owner can delete the order." });
    }

    await OrderItem.destroy({ where: { order_id: orderId } });
    await order.destroy();

    res.json({ message: "Order cancelled successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message || "Something went wrong!" });
  }
};
