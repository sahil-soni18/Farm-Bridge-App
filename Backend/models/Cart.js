import sequelize from "../db/db.js";
import { DataTypes } from "sequelize";
import User from "./User.js";
import Product from "./Product.js";

const Cart = sequelize.define(
  "Cart",
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
  },
  {
    modelName: "Cart",
    tableName: "cart",
    timestamps: true,
  }
);

User.hasMany(Cart, { foreignKey: "user_id" });
Cart.belongsTo(User, { foreignKey: "user_id" });
Product.hasMany(Cart, { foreignKey: "product_id" });
Cart.belongsTo(Product, { foreignKey: "product_id" });

export default Cart;
