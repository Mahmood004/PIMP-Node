'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all(
      [
        queryInterface.changeColumn('deal', 'projected_irr', Sequelize.DECIMAL(10, 2)),
        queryInterface.changeColumn('deal', 'projected_multiple', Sequelize.DECIMAL(10, 2)),
        queryInterface.changeColumn('user_deal_interest', 'projected_irr', Sequelize.DECIMAL(10, 2)),
        queryInterface.changeColumn('user_deal_interest', 'projected_multiple', Sequelize.DECIMAL(10, 2))
      ]
    );
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all(
      [
        queryInterface.changeColumn('deal', 'projected_irr', Sequelize.DECIMAL),
        queryInterface.changeColumn('deal', 'projected_multiple', Sequelize.DECIMAL),
        queryInterface.changeColumn('user_deal_interest', 'projected_irr', Sequelize.DECIMAL),
        queryInterface.changeColumn('user_deal_interest', 'projected_multiple', Sequelize.DECIMAL)
      ]
    );
  }
};
