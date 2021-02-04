'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.renameColumn('Users', 'firstName', 'first_name'),
      queryInterface.renameColumn('Users', 'lastName', 'last_name'),
      queryInterface.renameColumn('Users', 'userTypeId', 'user_type_id')
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.renameColumn('Users', 'first_name', 'firstName'),
      queryInterface.renameColumn('Users', 'last_name', 'lastName'),
      queryInterface.renameColumn('Users', 'user_type_id', 'userTypeId')
    ]);
  }
};
