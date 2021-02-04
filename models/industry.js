'use strict';
module.exports = (sequelize, DataTypes) => {
  const industry = sequelize.define('industry', {
    industry_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Date.now() },
    updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Date.now() },
  }, {
    freezeTableName: true,
    tableName: 'industry',
    timestamps: false
  });
  industry.associate = function(models) {
    // associations can be defined here
  };
  return industry;
};