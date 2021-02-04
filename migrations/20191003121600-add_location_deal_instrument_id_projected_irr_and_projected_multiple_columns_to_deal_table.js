'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all(
      [
        queryInterface.addColumn('deal', 'location', Sequelize.STRING),
        queryInterface.addColumn(
          'deal', 
          'deal_instrument_id',
          {
            type: Sequelize.INTEGER,
            references: {
              model: 'deal_instrument',
              key: 'deal_instrument_id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
          }  
        ),
        queryInterface.addColumn('deal', 'projected_irr', Sequelize.DECIMAL),
        queryInterface.addColumn('deal', 'projected_multiple', Sequelize.DECIMAL)
      ]
    )
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all(
      [
        queryInterface.removeColumn('deal', 'location'),
        queryInterface.removeColumn('deal', 'deal_instrument_id'),
        queryInterface.removeColumn('deal', 'projected_irr'),
        queryInterface.removeColumn('deal', 'projected_multiple')
      ]
    )
  }
};
