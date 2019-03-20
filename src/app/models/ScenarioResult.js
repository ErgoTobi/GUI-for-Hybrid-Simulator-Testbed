'use strict';
module.exports = (sequelize, DataTypes) => {
  const ScenarioResult = sequelize.define('ScenarioResult', {
    name: DataTypes.STRING,
    startTimestamp: DataTypes.DATE,
    duration: DataTypes.TIME,
    testsetResultId: DataTypes.INTEGER,
    scenarioId: DataTypes.INTEGER
  }, {});
  ScenarioResult.associate = function(models) {
    // associations can be defined here
  };
  return ScenarioResult;
};