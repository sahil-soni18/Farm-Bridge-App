import sequelize from "../db/db.js";
import { DataTypes } from 'sequelize';
import User from './User.js'; // Import the User model

const Product = sequelize.define(
  'Product',
  {
    _id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user_id: { // Foreign key to the User model
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: '_id',
      },
      onDelete: 'CASCADE', // Deletes products if the user is deleted
    },
  },
  {
    modelName: 'Product',
    tableName: 'products',
    timestamps: true,
  }
);

// Define relationships
User.hasMany(Product, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Product.belongsTo(User, { foreignKey: 'user_id' });

export default Product;
