'use strict';
module.exports = (sequelize, DataTypes) => {
  const user_deal_interest = sequelize.define('user_deal_interest', {
    user_deal_interest_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: DataTypes.INTEGER,
    interest_level_id: DataTypes.INTEGER,
    first_viewed_date: DataTypes.DATE,
    last_viewed_date: DataTypes.DATE,
    favorite: DataTypes.BOOLEAN,
    date_added: DataTypes.DATE,
    interest_level_updated_date: DataTypes.DATE,
    anticipated_investment: DataTypes.STRING,
    notes: DataTypes.TEXT,
    view_counter: DataTypes.INTEGER,
    interest_reason: DataTypes.TEXT,
    funds_needed_date: DataTypes.DATE,
    hold_period: DataTypes.STRING,
    projected_irr: DataTypes.DECIMAL(10, 2),
    projected_multiple: DataTypes.DECIMAL(10, 2),
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Date.now() },
    updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Date.now() },
  }, {
    freezeTableName: true,
    tableName: 'user_deal_interest',
    timestamps: false
  });
  user_deal_interest.associate = function(models) {
    // associations can be defined here
    user_deal_interest.belongsTo(models.User, {
      foreignKey: {
        name: 'user_id'
      }
    });
    user_deal_interest.belongsTo(models.deal, {
      foreignKey: {
        name: 'deal_id'
      }
    });
    user_deal_interest.belongsTo(models.interest_level, {
      foreignKey: {
        name: 'interest_level_id'
      }
    })
  };
  return user_deal_interest;
};