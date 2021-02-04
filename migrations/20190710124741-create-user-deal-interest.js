'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('user_deal_interest', {
      user_deal_interest_id: {
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
      interest_level_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'interest_level',
          key: 'interest_level_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      first_viewed_date: {
        type: Sequelize.DATE
      },
      last_viewed_date: {
        type: Sequelize.DATE
      },
      favorite: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      date_added: {
        type: Sequelize.DATE
      },
      interest_level_updated_date: {
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
    return queryInterface.dropTable('user_deal_interest');
  }
};