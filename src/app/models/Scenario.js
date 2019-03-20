'use strict';
module.exports = (sequelize, DataTypes) => {
  const Scenario = sequelize.define('Scenario', {
    name: DataTypes.STRING,
    mode: DataTypes.STRING,
    route: DataTypes.STRING,
    runQuantity: DataTypes.INTEGER,
    isTextOnly: DataTypes.BOOLEAN,
    testsetId: DataTypes.INTEGER
  }, {});
  Scenario.associate = function(models) {
  };
  return Scenario;
};