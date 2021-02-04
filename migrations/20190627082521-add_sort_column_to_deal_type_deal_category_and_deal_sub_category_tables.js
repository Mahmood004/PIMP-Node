'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'deal_type',
        'sort',
        {
          type: Sequelize.TINYINT,
          defaultValue: 0
        }
      ),
      queryInterface.addColumn(
        'deal_category',
        'sort',
        {
          type: Sequelize.TINYINT,
          defaultValue: 0
        }
      ),
      queryInterface.addColumn(
        'deal_sub_category',
        'sort',
        {
          type: Sequelize.TINYINT,
          defaultValue: 0
        }
      )
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('deal_type', 'sort'),
      queryInterface.removeColumn('deal_category', 'sort'),
      queryInterface.removeColumn('deal_sub_category', 'sort')
    ]);
  }
};
