'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Users',
      'approved_by',
      {
        type: Sequelize.INTEGER,
        defaultValue: 0
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Users',
      'approved_by'
    );
  }
};
