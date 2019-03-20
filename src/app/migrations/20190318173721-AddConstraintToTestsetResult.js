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
          queryInterface.addConstraint('testsetresults', ['testsetId'], {
              type: 'foreign key',
              name: 'fk_testsetresults_user',
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
      return queryInterface.removeConstraint('testsetresults', 'fk_testsetresults_user');
  }
};
