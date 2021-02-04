'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('user_deal_interest_history', {
      user_deal_interest_history_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'user',
          key: 'user_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
      change_date: {
        type: Sequelize.DATE
      },
      from_interest_level_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'interest_level',
          key: 'interest_level_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      to_interest_level_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'interest_level',
          key: 'interest_level_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      from_interest_reason: {
        type: Sequelize.TEXT
      },
      to_interest_reason: {
        type: Sequelize.TEXT
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('user_deal_interest_history');
  }
};