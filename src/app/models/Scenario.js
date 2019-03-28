'use strict';
module.exports = (sequelize, DataTypes) => {
  const Scenario = sequelize.define('scenario', {
    name: DataTypes.STRING,
    mode: DataTypes.STRING,
    route: DataTypes.STRING,
    runQuantity: DataTypes.INTEGER,
    faultInjectionTime: DataTypes.INTEGER,
    testsetId: DataTypes.INTEGER
  }, {});
  Scenario.associate = function(models) {
  };
  return Scenario;
};