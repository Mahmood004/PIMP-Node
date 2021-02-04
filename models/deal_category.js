'use strict';
module.exports = (sequelize, DataTypes) => {
  const deal_category = sequelize.define('deal_category', {
    deal_category_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    description: DataTypes.TEXT,
    active: DataTypes.BOOLEAN,
    sort: DataTypes.TINYINT,
    deal_profile_settings: DataTypes.TEXT,
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Date.now() },
    updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Date.now() },
  }, {
    freezeTableName: true,
    tableName: 'deal_category',
    timestamps: false
  });
  deal_category.associate = function(models) {
    // associations can be defined here
    deal_category.belongsTo(models.deal_type, {
      foreignKey: {
        name: 'deal_type_id'
      }
    });
    deal_category.hasMany(models.deal_sub_category, {
      foreignKey: 'deal_category_id'
    })
  };
  return deal_category;
};