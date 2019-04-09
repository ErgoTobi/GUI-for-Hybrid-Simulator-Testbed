'use strict';
module.exports = (sequelize, DataTypes) => {
  const RunDetail = sequelize.define('rundetail', {
    relativeTime: DataTypes.STRING,
    key: DataTypes.STRING,
    value: DataTypes.STRING,
    runId: DataTypes.INTEGER
  }, {});
  RunDetail.associate = function(models) {
    // associations can be defined here
  };
  return RunDetail;
};