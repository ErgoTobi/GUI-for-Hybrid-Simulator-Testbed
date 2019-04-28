'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
      return queryInterface.bulkInsert('settings', [{
            id: 1,
            name: 'speeddreams',
            isTextOnly: false,
            selectedModule: false
          },
          {
              id: 2,
              name: 'robotarmcontroller',
              isTextOnly: false,
              selectedModule: false
          },
          {
              id: 3,
              name: 'othersimulator',
              isTextOnly: false,
              selectedModule: false
          }], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
      return queryInterface.bulkDelete('settings', null, {});
  }
};
