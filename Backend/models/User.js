// Import the built-in data types
import { DataTypes } from 'sequelize';
import sequelize from '../db/db.js';

const User = sequelize.define(
  'User',
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isFarmer: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
  }
);

export default User;
