'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'user',
      'user_profile_type_id',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'user_profile_type',
          key: 'user_profile_type_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'user',
      'user_profile_type_id'
    );
  }
};
