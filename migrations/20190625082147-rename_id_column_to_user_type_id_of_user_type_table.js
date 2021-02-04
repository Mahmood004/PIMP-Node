'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query('ALTER TABLE user_type DROP PRIMARY KEY, CHANGE id user_type_id int(11) AUTO_INCREMENT, ADD PRIMARY KEY(user_type_id)');
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query('ALTER TABLE user_type DROP PRIMARY KEY, CHANGE user_type_id id int(11) AUTO_INCREMENT, ADD PRIMARY KEY(id)');
  }
};
