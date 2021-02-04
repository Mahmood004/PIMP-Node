'use strict';
module.exports = (sequelize, DataTypes) => {
  const deal_sub_category = sequelize.define('deal_sub_category', {
    deal_sub_category_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    deal_category_id: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    active: DataTypes.BOOLEAN,
    sort: DataTypes.TINYINT,
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Date.now() },
    updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Date.now() },
  }, {
    freezeTableName: true,
    tableName: 'deal_sub_category',
    timestamps: false
  });
  deal_sub_category.associate = function(models) {
    // associations can be defined here
    deal_sub_category.belongsTo(models.deal_category, {
      foreignKey: {
        name: 'deal_category_id'
      }
    });
  };
  return deal_sub_category;
};