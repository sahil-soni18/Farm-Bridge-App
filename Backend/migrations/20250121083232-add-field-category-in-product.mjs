import { DataTypes } from 'sequelize';

export async function up(queryInterface) {
  await queryInterface.addColumn('products', 'category', {
    type: DataTypes.STRING,
    allowNull: false, // Match the model definition
    defaultValue: 'Unknown',
  });
}

export async function down(queryInterface) {
  await queryInterface.removeColumn('products', 'category');
}
