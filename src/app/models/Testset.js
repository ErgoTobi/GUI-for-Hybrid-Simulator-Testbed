'use strict';
module.exports = (sequelize, DataTypes) => {
  const Testset = sequelize.define('Testset', {
    name: DataTypes.STRING
  }, {});
  Testset.associate = function(models) {
  };
  return Testset;
};