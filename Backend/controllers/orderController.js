import Order from "../models/Orders.js";
import OrderItem from "../models/OrderItem.js";
import Product from "../models/Product.js";
import sequelize from "../db/db.js";

export const createOrder = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { userId } = req.user;
    const { items, total_price } = req.body;

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
