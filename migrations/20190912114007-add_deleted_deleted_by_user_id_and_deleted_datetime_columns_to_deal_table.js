'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all(
      [
        queryInterface.addColumn(
          'deal', 
          'deleted', 
          {
            type: Sequelize.BOOLEAN,
            defaultValue: false
          }
        ),
        queryInterface.addColumn('deal', 'deleted_by_user_id', Sequelize.INTEGER),
        queryInterface.addColumn('deal', 'deleted_datetime', Sequelize.DATE)
      ]
    );
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all(
      [
        queryInterface.removeColumn('deal', 'deleted'),
        queryInterface.removeColumn('deal', 'deleted_by_user_id'),
        queryInterface.removeColumn('deal', 'deleted_datetime')
      ]
    );
  }
};
