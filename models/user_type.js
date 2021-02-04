'use strict';
module.exports = (sequelize, DataTypes) => {
  const user_type = sequelize.define('user_type', {
    user_type_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    role: DataTypes.STRING,
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Date.now() },
    updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Date.now() },
  }, {
    freezeTableName: true,
    tableName: 'user_type',
    timestamps: false
  });
  user_type.associate = function(models) {
    // associations can be defined here
  };
  return user_type;
};