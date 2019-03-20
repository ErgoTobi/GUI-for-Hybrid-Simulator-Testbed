'use strict';
module.exports = (sequelize, DataTypes) => {
  const RunResult = sequelize.define('RunResult', {
    startTimestamp: DataTypes.DATE,
    duration: DataTypes.TIME,
    state: DataTypes.STRING,
    scenarioResultId: DataTypes.INTEGER
  }, {});
  RunResult.associate = function(models) {
    // associations can be defined here
  };
  return RunResult;
};