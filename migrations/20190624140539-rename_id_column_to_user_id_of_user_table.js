'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query('ALTER TABLE user DROP PRIMARY KEY, CHANGE id user_id int(11) AUTO_INCREMENT, ADD PRIMARY KEY(user_id)');
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query('ALTER TABLE user DROP PRIMARY KEY, CHANGE user_id id int(11) AUTO_INCREMENT, ADD PRIMARY KEY(id)');
  }
};
