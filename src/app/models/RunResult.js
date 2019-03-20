'use strict';
module.exports = (sequelize, DataTypes) => {
  const RunResult = sequelize.define('runresult', {
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