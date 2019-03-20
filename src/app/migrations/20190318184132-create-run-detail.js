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
      startTimestamp: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      distance: {
        type: Sequelize.FLOAT
      },
      velocity: {
        type: Sequelize.FLOAT
      },
      ecu: {
        type: Sequelize.INTEGER
      },
      vehicle: {
        type: Sequelize.STRING
      },
      initiated: {
        type: Sequelize.BOOLEAN
      },
      actual: {
        type: Sequelize.BOOLEAN
      },
      runResultId: {
        type: Sequelize.INTEGER,
        references: {
            model: 'runresults',
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
    return queryInterface.dropTable('rundetails');
  }
};