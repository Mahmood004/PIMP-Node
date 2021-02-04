'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'user',
      'mailchimp_id',
      Sequelize.STRING,
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'user',
      'mailchimp_id'
    );
  }
};
