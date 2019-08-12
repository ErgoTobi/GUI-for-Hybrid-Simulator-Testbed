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
            selectedModule: false,
            quickrace: '~/speed-dreams/build/games/speed-dreams-2 -s quickrace',
            savm: 'qemu-system-arm -kernel /home/user1/operating-system/build/genode-focnados_pbxa9/var/run/idp_savm/image.elf -machine realview-pbx-a9 -m 1024 -nographic -smp 4 -net nic,macaddr=02:00:00:00:01:02 -net nic,model=e1000 -net vde,sock=/tmp/switch1'
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
