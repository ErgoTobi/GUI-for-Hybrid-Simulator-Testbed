'use strict';
module.exports = (sequelize, DataTypes) => {
  const Testset = sequelize.define('testset', {
    name: DataTypes.STRING
  }, {});
  Testset.associate = function(models) {
  };
  return Testset;
};