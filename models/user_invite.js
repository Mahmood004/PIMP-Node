'use strict';
module.exports = (sequelize, DataTypes) => {
  const user_invite = sequelize.define('user_invite', {
    user_invite_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    invite_user_id: DataTypes.INTEGER,
    invited_by_user_id: DataTypes.INTEGER,
    circle_id: DataTypes.INTEGER,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: DataTypes.STRING,
    date_added: DataTypes.DATE,
    date_accepted: DataTypes.DATE,
    date_completed: DataTypes.DATE,
    shortcode: DataTypes.STRING,
    approved: DataTypes.BOOLEAN,
    date_approved: DataTypes.DATE,
    approved_by: DataTypes.INTEGER,
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Date.now() },
    updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Date.now() },
  }, {
    freezeTableName: true,
    tableName: 'user_invite',
    timestamps: false
  });
  user_invite.associate = function(models) {
    // associations can be defined here
    user_invite.belongsTo(models.User, {
      foreignKey: {
        name: 'invite_user_id'
      }
    });

    user_invite.belongsTo(models.User, {
      foreignKey: {
        name: 'invited_by_user_id'
      },
    });

    user_invite.belongsTo(models.circle, {
      foreignKey: {
        name: 'circle_id'
      }
    });
    
  };
  return user_invite;
};