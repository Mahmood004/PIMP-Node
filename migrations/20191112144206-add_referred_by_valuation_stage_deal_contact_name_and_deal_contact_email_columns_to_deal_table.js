'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all(
      [
        queryInterface.addColumn('deal', 'referred_by', Sequelize.STRING(50)),
        queryInterface.addColumn('deal', 'valuation', Sequelize.DECIMAL(10, 2)),
        queryInterface.addColumn('deal', 'stage', Sequelize.STRING(25)),
        queryInterface.addColumn('deal', 'deal_contact_name', Sequelize.STRING(50)),
        queryInterface.addColumn('deal', 'deal_contact_email', Sequelize.STRING(50))
      ]
    )
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all(
      [
        queryInterface.removeColumn('deal', 'referred_by'),
        queryInterface.removeColumn('deal', 'valuation'),
        queryInterface.removeColumn('deal', 'stage'),
        queryInterface.removeColumn('deal', 'deal_contact_name'),
        queryInterface.removeColumn('deal', 'deal_contact_email')
      ]
    )
  }
};
