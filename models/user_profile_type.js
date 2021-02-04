'use strict';
module.exports = (sequelize, DataTypes) => {
  const user_profile_type = sequelize.define('user_profile_type', {
    user_profile_type_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    description: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Date.now() },
    updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Date.now() },
  }, {
    freezeTableName: true,
    tableName: 'user_profile_type',
    timestamps: false
  });
  user_profile_type.associate = function(models) {
    // associations can be defined here
  };
  return user_profile_type;
};