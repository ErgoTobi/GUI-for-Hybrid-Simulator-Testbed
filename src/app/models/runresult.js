/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('runresult', {
    id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    duration: {
      type: DataTypes.TIME,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    ScenarioResult_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      references: {
        model: 'scenarioresult',
        key: 'id'
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'runresult'
  });
};
