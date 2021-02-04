'use strict';
module.exports = (sequelize, DataTypes) => {
  const user_deal_category = sequelize.define('user_deal_category', {
    user_deal_category_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: DataTypes.INTEGER,
    deal_category_id: DataTypes.INTEGER,
    deal_sub_category_id: DataTypes.INTEGER,
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Date.now() },
    updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Date.now() },
  }, {
    freezeTableName: true,
    tableName: 'user_deal_category',
    timestamps: false
  });
  user_deal_category.associate = function(models) {
    // associations can be defined here
    user_deal_category.belongsTo(models.User, {
      foreignKey: {
        name: 'user_id'
      }
    });
    user_deal_category.belongsTo(models.deal_category, {
      foreignKey: {
        name: 'deal_category_id'
      }
    });
    user_deal_category.belongsTo(models.deal_sub_category, {
      foreignKey: {
        name: 'deal_sub_category_id'
      }
    })
  };
  return user_deal_category;
};