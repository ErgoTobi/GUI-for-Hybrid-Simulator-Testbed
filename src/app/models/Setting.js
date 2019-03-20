'use strict';
module.exports = (sequelize, DataTypes) => {
  const Setting = sequelize.define('setting', {
    name: DataTypes.STRING,
    ecuAmount: DataTypes.INTEGER
  }, {});
  Setting.associate = function(models) {
    // associations can be defined here
  };
  return Setting;
};