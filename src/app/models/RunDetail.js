'use strict';
module.exports = (sequelize, DataTypes) => {
  const RunDetail = sequelize.define('RunDetail', {
    startTimestamp: DataTypes.DATE,
    distance: DataTypes.FLOAT,
    velocity: DataTypes.FLOAT,
    ecu: DataTypes.INTEGER,
    vehicle: DataTypes.STRING,
    initiated: DataTypes.BOOLEAN,
    actual: DataTypes.BOOLEAN,
    runResultId: DataTypes.INTEGER
  }, {});
  RunDetail.associate = function(models) {
    // associations can be defined here
  };
  return RunDetail;
};