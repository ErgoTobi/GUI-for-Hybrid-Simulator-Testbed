'use strict';
module.exports = (sequelize, DataTypes) => {
  const Result = sequelize.define('result', {
    name: DataTypes.STRING,
    startTimestamp: DataTypes.INTEGER,
    duration: DataTypes.STRING,
    testsetId: DataTypes.INTEGER
  }, {});
  Result.associate = function(models) {
    // associations can be defined here
  };
  return Result;
};