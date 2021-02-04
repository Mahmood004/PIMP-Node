'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'user_deal_activity',
      'deal_document_id',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'deal_document',
          key: 'deal_document_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('user_deal_activity', 'deal_document_id');
  }
};
