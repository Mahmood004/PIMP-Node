'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'user_deal_interest',
      'view_counter',
      {
        type: Sequelize.INTEGER,
        defaultValue: 1
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'user_deal_interest',
      'view_counter'
    );
  }
};
