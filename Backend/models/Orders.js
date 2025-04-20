import sequelize from "../db/db.js";
import { DataTypes } from "sequelize";
import User from "./User.js";
import Payment from "./Payment.js";

const Order = sequelize.define(
  "Order",
  {
    _id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "_id",
      },
      onDelete: "CASCADE",
    },
    status: {
      type: DataTypes.ENUM(
        "pending",
        "confirmed",
        "shipped",
        "delivered",
        "cancelled"
      ),
      defaultValue: "pending",
    },
    total_price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    paymentId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: Payment,
        key: "_id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    modelName: "Order",
    tableName: "orders",
    timestamps: true,
  }
);

User.hasMany(Order, { foreignKey: "userId" });
Order.belongsTo(User, { foreignKey: "userId" });

Order.hasOne(Payment, { foreignKey: "orderId" });
Payment.belongsTo(Order, { foreignKey: "orderId" });

Order.belongsTo(Payment, { foreignKey: 'paymentId' });
Payment.hasOne(Order, { foreignKey: 'paymentId' });


export default Order;
