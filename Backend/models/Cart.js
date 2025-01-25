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
    userId: {
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Crop",
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

User.hasMany(Cart, { foreignKey: "userId" });
Cart.belongsTo(User, { foreignKey: "userId" });
Product.hasMany(Cart, { foreignKey: "product_id" });
Cart.belongsTo(Product, { foreignKey: "product_id" });

export default Cart;
