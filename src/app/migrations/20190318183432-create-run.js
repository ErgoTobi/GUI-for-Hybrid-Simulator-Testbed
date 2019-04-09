'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('runs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      startTimestamp: {
        type: Sequelize.INTEGER,
        // defaultValue: Sequelize.fn('NOW')
      },
      duration: {
        type: Sequelize.STRING
      },
      state: {
        type: Sequelize.INTEGER
      },
      scenarioId: {
          type: Sequelize.INTEGER
      },
      resultId: {
        type: Sequelize.INTEGER,
          references: {
              model: 'results',
              key: 'id'
          }
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
    return queryInterface.dropTable('runs');
  }
};