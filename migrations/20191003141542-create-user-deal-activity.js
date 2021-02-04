'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('user_deal_activity', {
      user_deal_activity_id: {
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
      activity_date: {
        type: Sequelize.DATE
      },
      activity_type: {
        type: Sequelize.INTEGER,
        references: {
          model: 'user_activity_type',
          key: 'user_activity_type_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      notes: {
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
    return queryInterface.dropTable('user_deal_activity');
  }
};