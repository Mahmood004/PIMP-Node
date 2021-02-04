'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all(
      [
        queryInterface.addColumn('deal', 'company_name', Sequelize.STRING),
        queryInterface.addColumn('deal', 'sponsor_name', Sequelize.STRING)
      ]
    );
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('deal', 'company_name'),
      queryInterface.removeColumn('deal', 'sponsor_name')
    ]);
  }
};
