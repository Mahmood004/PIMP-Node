'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    user_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    user_type_id: DataTypes.INTEGER,
    approved: DataTypes.BOOLEAN,
    approved_by: DataTypes.INTEGER,
    approved_date: DataTypes.DATE,
    provider_id: DataTypes.STRING,
    provider_name: DataTypes.STRING,
    profile: DataTypes.STRING,
    user_profile_type_id: DataTypes.INTEGER,
    mailchimp_id: DataTypes.STRING,
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Date.now() },
    updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Date.now() },
    
  }, {
    freezeTableName: true,
    tableName: 'user',
    timestamps: false
  });
  User.associate = function(models) {

    // associations can be defined here

    User.belongsTo(models.user_type, {
      foreignKey: {
        name: 'user_type_id'
      }
    });

    User.belongsTo(models.user_profile_type, {
      foreignKey: {
        name: 'user_profile_type_id'
      }
    });

    User.hasMany(models.user_invite, {
      foreignKey: {
        name: 'invite_user_id',
      },
      as: 'invitations_received'
    });

    User.hasMany(models.user_invite, {
      foreignKey: {
        name: 'invited_by_user_id',
      },
      as: 'invitations_sent'
    })

    User.hasMany(models.user_circle, {
      foreignKey: {
        name: 'user_id'
      }
    });

    User.hasMany(models.user_industry, {
      foreignKey: {
        name: 'user_id'
      }
    });

    User.hasMany(models.deal, {
      foreignKey: {
        name: 'submit_by_user_id'
      }
    });

    User.hasMany(models.user_deal_category, {
      foreignKey: {
        name: 'user_id'
      }
    });

  };
  return User;
};