'use strict';
module.exports = (sequelize, DataTypes) => {
  const user_deal_activity = sequelize.define('user_deal_activity', {
    user_deal_activity_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: DataTypes.INTEGER,
    deal_id: DataTypes.INTEGER,
    activity_date: DataTypes.DATE,
    activity_type: DataTypes.INTEGER,
    notes: DataTypes.TEXT,
    deal_document_id: DataTypes.INTEGER
  }, {
    freezeTableName: true,
    tableName: 'user_deal_activity',
    underscored: true,
  });
  user_deal_activity.associate = function(models) {
    // associations can be defined here
    user_deal_activity.belongsTo(models.User, {
      foreignKey: {
        name: 'user_id'
      }
    });
    user_deal_activity.belongsTo(models.deal, {
      foreignKey: {
        name: 'deal_id'
      }
    });
    user_deal_activity.belongsTo(models.user_activity_type, {
      foreignKey: {
        name: 'activity_type'
      }
    });
    user_deal_activity.belongsTo(models.deal_document, {
      foreignKey: {
        name: 'deal_document_id'
      }
    });
  };
  return user_deal_activity;
};