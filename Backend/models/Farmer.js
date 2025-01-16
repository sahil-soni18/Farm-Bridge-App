import sequelize from "../db/db";

const FarmerProfile = sequelize.define(
    'FarmerProfile',
    {
      _id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      farm_location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      products_grown: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      modelName: 'FarmerProfile',
      tableName: 'farmer_profiles',
      timestamps: true,
    }
  );
  
  // Association
  User.hasOne(FarmerProfile, { foreignKey: '_id' });
  FarmerProfile.belongsTo(User, { foreignKey: '_id' });
  
  export default FarmerProfile;
  