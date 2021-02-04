'use strict';
module.exports = (sequelize, DataTypes) => {
  const user_deal_interest_history = sequelize.define('user_deal_interest_history', {
    user_deal_interest_history_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: DataTypes.INTEGER,
    deal_id: DataTypes.INTEGER,
    change_date: DataTypes.DATE,
    from_interest_level_id: DataTypes.INTEGER,
    to_interest_level_id: DataTypes.INTEGER,
    from_interest_reason: DataTypes.TEXT,
    to_interest_reason: DataTypes.TEXT
  }, {
    freezeTableName: true,
    tableName: 'user_deal_interest_history',
    underscored: true,
  });
  user_deal_interest_history.associate = function(models) {
    // associations can be defined 
    user_deal_interest_history.belongsTo(models.User, {
      foreignKey: {
        name: 'user_id'
      }
    });

    user_deal_interest_history.belongsTo(models.deal, {
      foreignKey: {
        name: 'deal_id'
      }
    });

    user_deal_interest_history.belongsTo(models.interest_level, {
      foreignKey: {
        name: 'from_interest_level_id'
      },
      as: 'from_interest'
    });

    user_deal_interest_history.belongsTo(models.interest_level, {
      foreignKey: {
        name: 'to_interest_level_id'
      },
      as: 'to_interest'
    });

  };
  return user_deal_interest_history;
};