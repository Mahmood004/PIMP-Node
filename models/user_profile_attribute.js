'use strict';
module.exports = (sequelize, DataTypes) => {
  const user_profile_attribute = sequelize.define('user_profile_attribute', {
    user_profile_attribute_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    attribute_name: DataTypes.STRING,
    attribute_value: DataTypes.STRING,
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Date.now() },
    updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Date.now() },
  }, {
    freezeTableName: true,
    tableName: 'user_profile_attribute',
    timestamps: false
  });
  user_profile_attribute.associate = function(models) {
    // associations can be defined here
  };
  return user_profile_attribute;
};