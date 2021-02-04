'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all(
      [
        queryInterface.renameColumn('circle', 'createdAt', 'created_at'),
        queryInterface.renameColumn('circle', 'updatedAt', 'updated_at'),
        queryInterface.renameColumn('deal', 'createdAt', 'created_at'),
        queryInterface.renameColumn('deal', 'updatedAt', 'updated_at'),
        queryInterface.renameColumn('deal_category', 'createdAt', 'created_at'),
        queryInterface.renameColumn('deal_category', 'updatedAt', 'updated_at'),
        queryInterface.renameColumn('deal_circle', 'createdAt', 'created_at'),
        queryInterface.renameColumn('deal_circle', 'updatedAt', 'updated_at'),
        queryInterface.renameColumn('deal_document', 'createdAt', 'created_at'),
        queryInterface.renameColumn('deal_document', 'updatedAt', 'updated_at'),
        queryInterface.renameColumn('deal_status', 'createdAt', 'created_at'),
        queryInterface.renameColumn('deal_status', 'updatedAt', 'updated_at'),
        queryInterface.renameColumn('deal_sub_category', 'createdAt', 'created_at'),
        queryInterface.renameColumn('deal_sub_category', 'updatedAt', 'updated_at'),
        queryInterface.renameColumn('deal_type', 'createdAt', 'created_at'),
        queryInterface.renameColumn('deal_type', 'updatedAt', 'updated_at'),
        queryInterface.renameColumn('industry', 'createdAt', 'created_at'),
        queryInterface.renameColumn('industry', 'updatedAt', 'updated_at'),
        queryInterface.renameColumn('interest_level', 'createdAt', 'created_at'),
        queryInterface.renameColumn('interest_level', 'updatedAt', 'updated_at'),
        queryInterface.renameColumn('user', 'createdAt', 'created_at'),
        queryInterface.renameColumn('user', 'updatedAt', 'updated_at'),
        queryInterface.renameColumn('user_circle', 'createdAt', 'created_at'),
        queryInterface.renameColumn('user_circle', 'updatedAt', 'updated_at'),
        queryInterface.renameColumn('user_deal_category', 'createdAt', 'created_at'),
        queryInterface.renameColumn('user_deal_category', 'updatedAt', 'updated_at'),
        queryInterface.renameColumn('user_deal_interest', 'createdAt', 'created_at'),
        queryInterface.renameColumn('user_deal_interest', 'updatedAt', 'updated_at'),
        queryInterface.renameColumn('user_industry', 'createdAt', 'created_at'),
        queryInterface.renameColumn('user_industry', 'updatedAt', 'updated_at'),
        queryInterface.renameColumn('user_invite', 'createdAt', 'created_at'),
        queryInterface.renameColumn('user_invite', 'updatedAt', 'updated_at'),
        queryInterface.renameColumn('user_profile_attribute', 'createdAt', 'created_at'),
        queryInterface.renameColumn('user_profile_attribute', 'updatedAt', 'updated_at'),
        queryInterface.renameColumn('user_profile_type', 'createdAt', 'created_at'),
        queryInterface.renameColumn('user_profile_type', 'updatedAt', 'updated_at'),
        queryInterface.sequelize.query('ALTER TABLE user_type CHANGE createdAt created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP'),
        queryInterface.sequelize.query('ALTER TABLE user_type CHANGE updatedAt updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP')
      ]
    )
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all(
      [
        queryInterface.renameColumn('circle', 'created_at', 'createdAt'),
        queryInterface.renameColumn('circle', 'updated_at', 'updatedAt'),
        queryInterface.renameColumn('deal', 'created_at', 'createdAt'),
        queryInterface.renameColumn('deal', 'updated_at', 'updatedAt'),
        queryInterface.renameColumn('deal_category', 'created_at', 'createdAt'),
        queryInterface.renameColumn('deal_category', 'updated_at', 'updatedAt'),
        queryInterface.renameColumn('deal_circle', 'created_at', 'createdAt'),
        queryInterface.renameColumn('deal_circle', 'updated_at', 'updatedAt'),
        queryInterface.renameColumn('deal_document', 'created_at', 'createdAt'),
        queryInterface.renameColumn('deal_document', 'updated_at', 'updatedAt'),
        queryInterface.renameColumn('deal_status', 'created_at', 'createdAt'),
        queryInterface.renameColumn('deal_status', 'updated_at', 'updatedAt'),
        queryInterface.renameColumn('deal_sub_category', 'created_at', 'createdAt'),
        queryInterface.renameColumn('deal_sub_category', 'updated_at', 'updatedAt'),
        queryInterface.renameColumn('deal_type', 'created_at', 'createdAt'),
        queryInterface.renameColumn('deal_type', 'updated_at', 'updatedAt'),
        queryInterface.renameColumn('industry', 'created_at', 'createdAt'),
        queryInterface.renameColumn('industry', 'updated_at', 'updatedAt'),
        queryInterface.renameColumn('interest_level', 'created_at', 'createdAt'),
        queryInterface.renameColumn('interest_level', 'updated_at', 'updatedAt'),
        queryInterface.renameColumn('user', 'created_at', 'createdAt'),
        queryInterface.renameColumn('user', 'updated_at', 'updatedAt'),
        queryInterface.renameColumn('user_circle', 'created_at', 'createdAt'),
        queryInterface.renameColumn('user_circle', 'updated_at', 'updatedAt'),
        queryInterface.renameColumn('user_deal_category', 'created_at', 'createdAt'),
        queryInterface.renameColumn('user_deal_category', 'updated_at', 'updatedAt'),
        queryInterface.renameColumn('user_deal_interest', 'created_at', 'createdAt'),
        queryInterface.renameColumn('user_deal_interest', 'updated_at', 'updatedAt'),
        queryInterface.renameColumn('user_industry', 'created_at', 'createdAt'),
        queryInterface.renameColumn('user_industry', 'updated_at', 'updatedAt'),
        queryInterface.renameColumn('user_invite', 'created_at', 'createdAt'),
        queryInterface.renameColumn('user_invite', 'updated_at', 'updatedAt'),
        queryInterface.renameColumn('user_profile_attribute', 'created_at', 'createdAt'),
        queryInterface.renameColumn('user_profile_attribute', 'updated_at', 'updatedAt'),
        queryInterface.renameColumn('user_profile_type', 'created_at', 'createdAt'),
        queryInterface.renameColumn('user_profile_type', 'updated_at', 'updatedAt'),
        queryInterface.sequelize.query('ALTER TABLE user_type CHANGE created_at createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP'),
        queryInterface.sequelize.query('ALTER TABLE user_type CHANGE updated_at updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP')
      ]
    )
  }
};
