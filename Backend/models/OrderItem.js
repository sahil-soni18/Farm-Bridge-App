import sequelize from "../db/db.js";
import { DataTypes } from "sequelize";
import Product from "./Product.js";
import Order from "./Orders.js";

const OrderItem = sequelize.define(
  "OrderItem",
  {
    _id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    order_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Order,
        key: "_id",
      },
      onDelete: "CASCADE",
    },
    product_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Product,
        key: "_id",
      },
      onDelete: "CASCADE",
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
  },
  {
    modelName: "OrderItem",
    tableName: "order_items",
    timestamps: true,
  }
);

Order.hasMany(OrderItem, { foreignKey: "order_id" });
OrderItem.belongsTo(Order, { foreignKey: "order_id" });
Product.hasMany(OrderItem, { foreignKey: "product_id" });
OrderItem.belongsTo(Product, { foreignKey: "product_id" });

export default OrderItem;
