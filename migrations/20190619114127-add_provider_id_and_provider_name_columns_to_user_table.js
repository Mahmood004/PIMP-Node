'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all(
      [
        queryInterface.addColumn(
          'Users',
          'provider_id',
          {
            type: Sequelize.STRING,
            defaultValue: null
          }
        ),
        queryInterface.addColumn(
          'Users',
          'provider_name',
          {
            type: Sequelize.STRING,
            defaultValue: null
          }
        )
      ]
    );
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all(
      [
        queryInterface.removeColumn('Users', 'provider_id'),
        queryInterface.removeColumn('Users', 'provider_name')
      ]
    );
  }
};
