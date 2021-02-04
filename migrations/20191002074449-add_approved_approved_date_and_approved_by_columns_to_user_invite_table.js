'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all(
      [
        queryInterface.addColumn(
          'user_invite', 
          'approved',
          {
            type: Sequelize.BOOLEAN,
            defaultValue: false
          }
        ),
        queryInterface.addColumn('user_invite', 'approved_date', Sequelize.DATE),
        queryInterface.addColumn('user_invite', 'approved_by', Sequelize.INTEGER)
      ]
    )
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all(
      [
        queryInterface.removeColumn('user_invite', 'approved'),
        queryInterface.removeColumn('user_invite', 'approved_date'),
        queryInterface.removeColumn('user_invite', 'approved_by')
      ]
    );
  }
};
