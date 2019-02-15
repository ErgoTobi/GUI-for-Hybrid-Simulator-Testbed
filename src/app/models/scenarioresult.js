/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('scenarioresult', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
        autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    startTimestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    duration: {
      type: DataTypes.TIME,
      allowNull: false
    },
    Scenario_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      references: {
        model: 'scenario',
        key: 'id'
      }
    },
    TestsetResult_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      references: {
        model: 'testsetresult',
        key: 'id'
      }
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'scenarioresult'
  });
};
