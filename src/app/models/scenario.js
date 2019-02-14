/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('scenario', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
        autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    mode: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    route: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    runQuantity: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false
    },
    isTextOnly: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: '0'
    },
    Testset_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      references: {
        model: 'testset',
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
    tableName: 'szenario'
  });
};
