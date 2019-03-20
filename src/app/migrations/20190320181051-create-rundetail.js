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
      timestamp: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      relativeTime: {
        type: Sequelize.TIME
      },
      car: {
        type: Sequelize.INTEGER
      },
      carIsPositionTracked: {
        type: Sequelize.BOOLEAN
      },
      carIsSpeedTracked: {
        type: Sequelize.BOOLEAN
      },
      carLeadPosLat: {
        type: Sequelize.DOUBLE
      },
      carLeadPosLong: {
        type: Sequelize.DOUBLE
      },
      carOwnPosLat: {
        type: Sequelize.DOUBLE
      },
      carOwnPosLong: {
        type: Sequelize.DOUBLE
      },
      carCornerFrontRightLat: {
        type: Sequelize.DOUBLE
      },
      carCornerFrontRightLong: {
        type: Sequelize.DOUBLE
      },
      carCornerFrontLeftLat: {
        type: Sequelize.DOUBLE
      },
      carCornerFrontLeftLong: {
        type: Sequelize.DOUBLE
      },
      carCornerRearRightLat: {
        type: Sequelize.DOUBLE
      },
      carCornerRearRightLong: {
        type: Sequelize.DOUBLE
      },
      carCornerRearLeftLat: {
        type: Sequelize.DOUBLE
      },
      carCornerRearLeftLong: {
        type: Sequelize.DOUBLE
      },
      carLeadSpeed: {
        type: Sequelize.DOUBLE
      },
      carOwnSpeed: {
        type: Sequelize.DOUBLE
      },
      carCurGear: {
        type: Sequelize.INTEGER
      },
      carSteerLock: {
        type: Sequelize.DOUBLE
      },
      carEnginerpm: {
        type: Sequelize.DOUBLE
      },
      carEnginerpmMax: {
        type: Sequelize.DOUBLE
      },
      carSteer: {
        type: Sequelize.DOUBLE
      },
      carBrakeFL: {
        type: Sequelize.DOUBLE
      },
      carBrakeFR: {
        type: Sequelize.DOUBLE
      },
      carBrakeRL: {
        type: Sequelize.DOUBLE
      },
      carBrakeRR: {
        type: Sequelize.DOUBLE
      },
      ecu: {
        type: Sequelize.STRING
      },
      ecuSteer: {
        type: Sequelize.DOUBLE
      },
      ecuAccel: {
        type: Sequelize.DOUBLE
      },
      ecuBrakeFL: {
        type: Sequelize.DOUBLE
      },
      ecuBrakeFR: {
        type: Sequelize.DOUBLE
      },
      ecuBrakeRL: {
        type: Sequelize.DOUBLE
      },
      ecuBrakeRR: {
        type: Sequelize.DOUBLE
      },
      ecuGear: {
        type: Sequelize.INTEGER
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