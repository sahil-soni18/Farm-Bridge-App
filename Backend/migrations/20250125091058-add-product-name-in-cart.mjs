"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("cart", "name", {
      type: Sequelize.STRING,
      allowNull: false, // Adjust based on your requirements
      defaultValue: "Crop"
    });
    
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("cart", "name");
  },
};
