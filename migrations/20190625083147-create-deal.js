'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('deal', {
      deal_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      shortcode: {
        type: Sequelize.STRING
      },
      deal_status_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'deal_status',
          key: 'deal_status_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      deal_category_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'deal_category',
          key: 'deal_category_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      deal_sub_category_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'deal_sub_category',
          key: 'deal_sub_category_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
      submit_date: {
        type: Sequelize.DATE
      },
      approved: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      approved_by_user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'user',
          key: 'user_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      approved_date: {
        type: Sequelize.DATE
      },
      summary: {
        type: Sequelize.TEXT
      },
      investment_amount_sought: {
        type: Sequelize.STRING
      },
      minimum_investment: {
        type: Sequelize.STRING
      },
      expected_close_date: {
        type: Sequelize.DATE
      },
      actual_close_date: {
        type: Sequelize.DATE
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
    return queryInterface.dropTable('deal');
  }
};