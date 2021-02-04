'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'deal',
      'deal_industry_id',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'industry',
          key: 'industry_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('deal', 'deal_industry_id');
  }
};
