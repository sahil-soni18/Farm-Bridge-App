import sequelize from "../db/db.js";
import Order from "../models/Orders.js";
import Payment from "../models/Payment.js";
import User from "../models/User.js";

export const MakePayment = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { userId } = req.user;
    const { amount, orderId, transaction_id } = req.body;

    // Create the payment
    const payment = await Payment.create(
      { userId, orderId, amount, transaction_id },
      { transaction }
    );
    const order = await Order.update(
      { paymentId: payment._id },
      {
        where: { _id: orderId },
        transaction,
      }
    );

    await transaction.commit();

    res.status(201).json({
      success: true,
      message: "Payment successfully",
      payment,
    });
  } catch (error) {
    transaction.rollback();
    res.status(500).json({
      success: false,
      message: "Error while making payment",
      error: error.message,
    });
  }
};

// Get All Payments by User Id

export const GetPaymentByUserId = async (req, res) => {
  const { userId } = req.user;
  console.log(`user id: ${userId}`);
  try {
    const payments = await Payment.findAll({
      where: { userId: userId },
      include: [{ model: Order }], // Assuming association is defined
    });

    console.log(`payment: ${JSON.stringify(payments)}`);

    if (!payments.length) {
      return res
        .status(404)
        .json({ message: "No payments found for this user." });
    }

    res.json({ payments });
  } catch (error) {
    res.status(500).json({ message: error.message || "Something went wrong!" });
  }
};

// Get payemnt bu transaction id

export const GetPaymentById = async (req, res) => {
  const { transaction_id } = req.params;
  try {
    const payemnt = await Payment.findOne({
      where: { transaction_id: transaction_id },
      include: [{ model: Order }],
    });

    if (!payemnt) {
      return res.status(404).json({ message: "No payment found." });
    }

    res.json({ payemnt });
  } catch (error) {
    res.status(500).json({ message: error.message || "Something went wrong!" });
  }
};
