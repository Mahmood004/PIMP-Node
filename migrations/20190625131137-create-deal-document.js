'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('deal_document', {
      deal_document_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      deal_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'deal',
          key: 'deal_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      file_name: {
        type: Sequelize.STRING
      },
      file_type: {
        type: Sequelize.STRING
      },
      submit_date: {
        type: Sequelize.DATE
      },
      submit_by_user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'user',
          key: 'user_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      file_size: {
        type: Sequelize.STRING
      },
      storage_location: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('deal_document');
  }
};