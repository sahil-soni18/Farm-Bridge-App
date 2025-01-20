'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Remove the user_id column from farmer_profiles
    await queryInterface.removeColumn('farmer_profiles', 'user_id');
  },

  async down(queryInterface, Sequelize) {
    // Add the user_id column back to farmer_profiles
    await queryInterface.addColumn('farmer_profiles', 'user_id', {
      type: Sequelize.UUID,
      allowNull: true, // Make it nullable
    });
  },
};
