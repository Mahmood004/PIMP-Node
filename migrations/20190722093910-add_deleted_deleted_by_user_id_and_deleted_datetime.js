'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all(
      [
        queryInterface.addColumn(
          'deal_document', 
          'deleted', 
          { 
            type: Sequelize.BOOLEAN, 
            defaultValue: false 
          }
        ),
        queryInterface.addColumn('deal_document', 'deleted_by_user_id', Sequelize.INTEGER),
        queryInterface.addColumn('deal_document', 'deleted_datetime', Sequelize.DATE)
      ]
    );
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all(
      [
        queryInterface.removeColumn('deal_document', 'deleted'),
        queryInterface.removeColumn('deal_document', 'deleted_by_user_id'),
        queryInterface.removeColumn('deal_document', 'deleted_datetime')
      ]
    );
  }
};
