'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('rundetails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      relativeTime: {
        type: Sequelize.STRING
      },
      key: {
        type: Sequelize.STRING
      },
      value: {
        type: Sequelize.STRING
      },
      runId: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('rundetails');
  }
};