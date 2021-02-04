'use strict';
module.exports = (sequelize, DataTypes) => {
  const interest_level = sequelize.define('interest_level', {
    interest_level_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Date.now() },
    updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Date.now() },
  }, {
    freezeTableName: true,
    tableName: 'interest_level',
    timestamps: false
  });
  interest_level.associate = function(models) {
    // associations can be defined here
  };
  return interest_level;
};