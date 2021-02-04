'use strict';
module.exports = (sequelize, DataTypes) => {
  const circle_admin = sequelize.define('circle_admin', {
    circle_admin_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    circle_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    added_by_user_id: DataTypes.INTEGER,
    added_date: DataTypes.DATE
  }, {
    freezeTableName: true,
    tableName: 'circle_admin',
    underscored: true,
  });
  circle_admin.associate = function(models) {
    // associations can be defined here
    circle_admin.belongsTo(models.circle, {
      foreignKey: {
        name: 'circle_id'
      }
    });

    circle_admin.belongsTo(models.User, {
      foreignKey: {
        name: 'user_id'
      }
    });

    circle_admin.belongsTo(models.User, {
      foreignKey: {
        name: 'added_by_user_id'
      }
    });
  };
  return circle_admin;
};