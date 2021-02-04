'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'deal_document',
      'short_description',
      Sequelize.STRING(100) 
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'deal_document',
      'short_description'
    );
  }
};
