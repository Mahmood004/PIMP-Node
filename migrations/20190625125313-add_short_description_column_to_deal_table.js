'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'deal',
      'short_description',
      Sequelize.STRING(50)
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'deal',
      'short_description'
    );
  }
};
