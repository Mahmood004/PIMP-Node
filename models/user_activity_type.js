'use strict';
module.exports = (sequelize, DataTypes) => {
  const user_activity_type = sequelize.define('user_activity_type', {
    user_activity_type_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    freezeTableName: true,
    tableName: 'user_activity_type',
    timestamps: false,
    underscored: true,
  });
  user_activity_type.associate = function(models) {
    // associations can be defined here
  };
  return user_activity_type;
};