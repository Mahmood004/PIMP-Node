'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('user_industry', {
      user_industry_id: {
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
      industry_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'industry',
          key: 'industry_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      relationship_type: {
        type: Sequelize.STRING(1)
      },
      date_added: {
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
    return queryInterface.dropTable('user_industry');
  }
};