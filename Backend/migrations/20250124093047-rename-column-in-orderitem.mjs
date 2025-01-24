"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("order_items", "productName", {
      type: Sequelize.STRING,
      allowNull: false, // Adjust based on your requirements
      defaultValue: "Crop"
    });
    
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("order_items", "productName");
  },
};
