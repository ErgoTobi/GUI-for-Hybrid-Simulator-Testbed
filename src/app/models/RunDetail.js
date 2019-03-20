'use strict';
module.exports = (sequelize, DataTypes) => {
  const RunDetail = sequelize.define('rundetail', {
    timestamp: DataTypes.DATE,
    relativeTime: DataTypes.TIME,
    car: DataTypes.INTEGER,
    carIsPositionTracked: DataTypes.BOOLEAN,
    carIsSpeedTracked: DataTypes.BOOLEAN,
    carLeadPosLat: DataTypes.DOUBLE,
    carLeadPosLong: DataTypes.DOUBLE,
    carOwnPosLat: DataTypes.DOUBLE,
    carOwnPosLong: DataTypes.DOUBLE,
    carCornerFrontRightLat: DataTypes.DOUBLE,
    carCornerFrontRightLong: DataTypes.DOUBLE,
    carCornerFrontLeftLat: DataTypes.DOUBLE,
    carCornerFrontLeftLong: DataTypes.DOUBLE,
    carCornerRearRightLat: DataTypes.DOUBLE,
    carCornerRearRightLong: DataTypes.DOUBLE,
    carCornerRearLeftLat: DataTypes.DOUBLE,
    carCornerRearLeftLong: DataTypes.DOUBLE,
    carLeadSpeed: DataTypes.DOUBLE,
    carOwnSpeed: DataTypes.DOUBLE,
    carCurGear: DataTypes.INTEGER,
    carSteerLock: DataTypes.DOUBLE,
    carEnginerpm: DataTypes.DOUBLE,
    carEnginerpmMax: DataTypes.DOUBLE,
    carSteer: DataTypes.DOUBLE,
    carBrakeFL: DataTypes.DOUBLE,
    carBrakeFR: DataTypes.DOUBLE,
    carBrakeRL: DataTypes.DOUBLE,
    carBrakeRR: DataTypes.DOUBLE,
    ecu: DataTypes.STRING,
    ecuSteer: DataTypes.DOUBLE,
    ecuAccel: DataTypes.DOUBLE,
    ecuBrakeFL: DataTypes.DOUBLE,
    ecuBrakeFR: DataTypes.DOUBLE,
    ecuBrakeRL: DataTypes.DOUBLE,
    ecuBrakeRR: DataTypes.DOUBLE,
    ecuGear: DataTypes.INTEGER,
    runResultId: DataTypes.INTEGER
  }, {});
  RunDetail.associate = function(models) {
    // associations can be defined here
  };
  return RunDetail;
};