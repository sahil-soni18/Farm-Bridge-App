import sequelize from "../db/db.js";
import { DataTypes } from "sequelize";

const Payment = sequelize.define(
  "Payment",
  {
    _id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    amount: {
      type: DataTypes.DECIMAL, // Changed from NUMBER to DECIMAL
      allowNull: false,
      defaultValue: 0
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    transaction_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    modelName: "Payment",
    tableName: "payments",
    timestamps: true,
  }
);

// Lazy loading of associations
export function setupPaymentAssociations() {
  const User = require('./User').default;
  const Order = require('./Order').default;
  
  Payment.belongsTo(User, { foreignKey: "userId" });
  Payment.belongsTo(Order, { foreignKey: "orderId" });
}

export default Payment;