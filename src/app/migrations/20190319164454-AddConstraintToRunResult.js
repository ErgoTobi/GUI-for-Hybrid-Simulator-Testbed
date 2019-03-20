'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return Promise.all([
        queryInterface.addConstraint('runresults', ['scenarioResultId'], {
            type: 'foreign key',
            name: 'fk_runresults_user',
            references: {
                table: 'scenarioresults',
                field: 'id'
            },
            onDelete: 'cascade',
            onUpdate: 'cascade'
        })
    ]);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
      return queryInterface.removeConstraint('runresults', 'fk_runresults_user');
  }
};
