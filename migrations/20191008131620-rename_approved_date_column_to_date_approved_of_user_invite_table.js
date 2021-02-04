'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('user_invite', 'approved_date', 'date_approved');
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('user_invite', 'date_approved', 'approved_date');
  }
};
