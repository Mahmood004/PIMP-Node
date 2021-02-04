'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('deal_circle', {
      deal_circle_id: {
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
      circle_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'circle',
          key: 'circle_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      added_by_user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'user',
          key: 'user_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      date_added: {
        type: Sequelize.DATE
      },
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
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
    return queryInterface.dropTable('deal_circle');
  }
};