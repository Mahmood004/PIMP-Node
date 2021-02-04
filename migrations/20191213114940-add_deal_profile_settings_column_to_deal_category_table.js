'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('deal_category', 'deal_profile_settings', Sequelize.TEXT);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('deal_category', 'deal_profile_settings');
  }
};
