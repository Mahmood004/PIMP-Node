'use strict';
module.exports = (sequelize, DataTypes) => {
  const deal_document_activity = sequelize.define('deal_document_activity', {
    deal_document_activity_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: DataTypes.INTEGER,
    date: DataTypes.DATE
  }, {
    freezeTableName: true,
    tableName: 'deal_document_activity',
    underscored: true,
  });
  deal_document_activity.associate = function(models) {
    // associations can be defined here
    deal_document_activity.belongsTo(models.User, {
      foreignKey: {
        name: 'user_id'
      }
    });
  };
  return deal_document_activity;
};