'use strict';
module.exports = (sequelize, DataTypes) => {
  const Setting = sequelize.define('setting', {
    name: DataTypes.STRING,
    isTextOnly: DataTypes.BOOLEAN,
    selectedModule: DataTypes.BOOLEAN,
    password: DataTypes.STRING,
  }, {});
  Setting.associate = function(models) {
    // associations can be defined here
  };
  return Setting;
};