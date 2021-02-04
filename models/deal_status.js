'use strict';
module.exports = (sequelize, DataTypes) => {
  const deal_status = sequelize.define('deal_status', {
    deal_status_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    description: DataTypes.TEXT,
    active: DataTypes.BOOLEAN,
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Date.now() },
    updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Date.now() },
  }, {
    freezeTableName: true,
    tableName: 'deal_status',
    timestamps: false
  });
  deal_status.associate = function(models) {
    // associations can be defined here
  };
  return deal_status;
};