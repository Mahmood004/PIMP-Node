'use strict';
module.exports = (sequelize, DataTypes) => {
  const user_circle = sequelize.define('user_circle', {
    user_circle_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: DataTypes.INTEGER,
    circle_id: DataTypes.INTEGER,
    date_added: DataTypes.DATE,
    invited_by_user_id: DataTypes.INTEGER,
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Date.now() },
    updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Date.now() },
  }, {
    freezeTableName: true,
    tableName: 'user_circle',
    timestamps: false
  });
  user_circle.associate = function(models) {
    // associations can be defined here
    user_circle.belongsTo(models.User, {
      foreignKey: {
        name: 'user_id'
      }
    });

    user_circle.belongsTo(models.circle, {
      foreignKey: {
        name: 'circle_id'
      }
    });
    
  };
  return user_circle;
};