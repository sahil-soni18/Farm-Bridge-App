// Import the built-in data types
import { DataTypes } from 'sequelize';
import sequelize from '../db/db.js';
import User from './User.js';

const FarmerProfile = sequelize.define(
  'FarmerProfile',
  {
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: User,
        key: '_id',
      },
    },
    farm_location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    products_grown: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    modelName: 'FarmerProfile',
    tableName: 'farmer_profiles',
    timestamps: true,
  }
);


// Association
User.hasOne(FarmerProfile, { foreignKey: 'userId' });
FarmerProfile.belongsTo(User, { foreignKey: 'userId' });

export default FarmerProfile;
