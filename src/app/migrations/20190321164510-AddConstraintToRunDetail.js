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
        queryInterface.addConstraint('rundetails', ['runResultId'], {
            type: 'foreign key',
            name: 'fk_rundetails_user',
            references: {
                table: 'runresults',
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
    return queryInterface.removeConstraint('rundetails', 'fk_rundetails_user');
  }
};
