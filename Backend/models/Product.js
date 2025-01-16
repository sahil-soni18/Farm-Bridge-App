import sequelize from "../db/db";
import { DataTypes } from 'sequelize';

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
    },
    {
      modelName: 'Product',
      tableName: 'products',
      timestamps: true,
    }
)

export default Product;