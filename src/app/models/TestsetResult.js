'use strict';
module.exports = (sequelize, DataTypes) => {
  const TestsetResult = sequelize.define('TestsetResult', {
    name: DataTypes.STRING,
    startTimestamp: DataTypes.DATE,
    duration: DataTypes.TIME,
    testsetId: DataTypes.INTEGER
  }, {});
  TestsetResult.associate = function(models) {
    // associations can be defined here
  };
  return TestsetResult;
};