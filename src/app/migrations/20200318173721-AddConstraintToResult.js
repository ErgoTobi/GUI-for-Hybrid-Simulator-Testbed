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
          queryInterface.addConstraint('results', ['testsetId'], {
              type: 'foreign key',
              name: 'fk_results_user',
              references: {
                  table: 'testsets',
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
      return queryInterface.removeConstraint('results', 'fk_results_user');
  }
};
