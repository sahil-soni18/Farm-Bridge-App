'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Rename the column 'user_id' to 'userId' in the 'farmer_profiles' table
    await queryInterface.renameColumn('farmer_profiles', 'user_id', 'userId');
  },

  async down (queryInterface, Sequelize) {
    // Revert the change (rename 'userId' back to 'user_id')
    await queryInterface.renameColumn('farmer_profiles', 'userId', 'user_id');
  }
};
