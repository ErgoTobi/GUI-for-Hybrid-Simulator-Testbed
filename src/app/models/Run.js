'use strict';
module.exports = (sequelize, DataTypes) => {
  const Run = sequelize.define('run', {
    startTimestamp: DataTypes.INTEGER,
    duration: DataTypes.STRING,
    state: DataTypes.INTEGER,
    scenarioId: DataTypes.INTEGER,
    resultId: DataTypes.INTEGER
  }, {});
  Run.associate = function(models) {
    // associations can be defined here
  };
  return Run;
};