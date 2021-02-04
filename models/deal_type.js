'use strict';
module.exports = (sequelize, DataTypes) => {
  const deal_type = sequelize.define('deal_type', {
    deal_type_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    description: DataTypes.TEXT,
    active: DataTypes.BOOLEAN,
    sort: DataTypes.TINYINT,
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Date.now() },
    updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Date.now() },
  }, {
    freezeTableName: true,
    tableName: 'deal_type',
    timestamps: false
  });
  deal_type.associate = function(models) {
    // associations can be defined here
    deal_type.hasMany(models.deal_category, {
      foreignKey: 'deal_type_id'
    })
  };
  return deal_type;
};