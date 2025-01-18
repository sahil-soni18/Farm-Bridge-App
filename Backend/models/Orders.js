import sequelize from "../db/db.js";
import { DataTypes } from "sequelize";
import User from "./User.js";

const Order = sequelize.define(
  "Order",
  {
    _id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "_id",
      },
      onDelete: "CASCADE",
    },
    status: {
      type: DataTypes.ENUM("pending", "confirmed", "shipped", "delivered", "cancelled"),
      defaultValue: "pending",
    },
    total_price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
  },
  {
    modelName: "Order",
    tableName: "orders",
    timestamps: true,
  }
);

User.hasMany(Order, { foreignKey: "user_id" });
Order.belongsTo(User, { foreignKey: "user_id" });

export default Order;
