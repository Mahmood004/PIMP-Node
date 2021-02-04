'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameTable('user_types', 'user_type');
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.renameTable('user_type', 'user_types');
  }
};
