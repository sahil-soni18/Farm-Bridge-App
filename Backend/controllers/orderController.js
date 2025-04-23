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

export const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const validStatuses = ["pending", "shipped", "delivered", "cancelled"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status provided." });
  }

  try {
    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    order.status = status;
    await order.save();

    res.json({
      success: true,
      message: "Order status updated successfully.",
      order,
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
