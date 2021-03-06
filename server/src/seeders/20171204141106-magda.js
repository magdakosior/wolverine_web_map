'use strict';

//node_modules/.bin/sequelize seed:generate --name Magda
//node_modules/.bin/sequelize db:seed:all

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:*/
      return queryInterface.bulkInsert('heros', [{
        name: 'Magda',
        createdAt: new Date(2017, 12, 4),
        updatedAt: new Date(2017, 12, 4) //'2017-12-4 13:50:07.452-07'
      }], {});
    
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
