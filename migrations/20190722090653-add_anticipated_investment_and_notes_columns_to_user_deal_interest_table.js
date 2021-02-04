'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all(
      [
        queryInterface.addColumn('user_deal_interest', 'anticipated_investment', Sequelize.STRING),
        queryInterface.addColumn('user_deal_interest', 'notes', Sequelize.STRING)
      ]
    );
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all(
      [
        queryInterface.removeColumn('user_deal_interest', 'anticipated_investment'),
        queryInterface.removeColumn('user_deal_interest', 'notes')
      ]
    );
  }
};
