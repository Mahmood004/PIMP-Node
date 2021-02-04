'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('user_deal_category', {
      user_deal_category_id: {
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
      deal_category_id: {
        allowNull: false,
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
    return queryInterface.dropTable('user_deal_category');
  }
};