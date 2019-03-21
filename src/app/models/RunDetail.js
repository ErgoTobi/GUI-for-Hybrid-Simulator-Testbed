'use strict';
module.exports = (sequelize, DataTypes) => {
  const RunDetail = sequelize.define('rundetail', {
    relativeTime: DataTypes.TIME,
    key: DataTypes.STRING,
    value: DataTypes.STRING,
    runResultId: DataTypes.INTEGER
  }, {});
  RunDetail.associate = function(models) {
    // associations can be defined here
  };
  return RunDetail;
};