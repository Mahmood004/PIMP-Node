'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn(
      'user_deal_interest',
      'notes',
      Sequelize.TEXT
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn(
      'user_deal_interest',
      'notes',
      Sequelize.STRING
    );
  }
};
