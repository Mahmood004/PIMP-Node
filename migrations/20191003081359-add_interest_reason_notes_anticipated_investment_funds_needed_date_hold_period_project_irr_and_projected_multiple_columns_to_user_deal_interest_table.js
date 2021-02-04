'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all(
      [
        queryInterface.addColumn('user_deal_interest', 'interest_reason', Sequelize.TEXT),
        queryInterface.addColumn('user_deal_interest', 'funds_needed_date', Sequelize.DATE),
        queryInterface.addColumn('user_deal_interest', 'hold_period', Sequelize.STRING),
        queryInterface.addColumn('user_deal_interest', 'projected_irr', Sequelize.DECIMAL),
        queryInterface.addColumn('user_deal_interest', 'projected_multiple', Sequelize.DECIMAL)
      ]
    )
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all(
      [
        queryInterface.removeColumn('user_deal_interest', 'interest_reason'),
        queryInterface.removeColumn('user_deal_interest', 'funds_needed_date'),
        queryInterface.removeColumn('user_deal_interest', 'hold_period'),
        queryInterface.removeColumn('user_deal_interest', 'projected_irr'),
        queryInterface.removeColumn('user_deal_interest', 'projected_multiple')
      ]
    )
  }
};
