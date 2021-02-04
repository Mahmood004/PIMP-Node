'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('user_circle', {
      user_circle_id: {
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
        onDelete: 'CASCADE',
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
      date_added: {
        type: Sequelize.DATE
      },
      invited_by_user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'user',
          key: 'user_id'
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
    return queryInterface.dropTable('user_circle');
  }
};