/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('scenarioresult', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
        autoIncrement: true
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    TestsetResult_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      references: {
        model: 'testsetresult',
        key: 'id'
      }
    },
    Scenario_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      references: {
        model: 'szenario',
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
    tableName: 'szenarioresult'
  });
};
