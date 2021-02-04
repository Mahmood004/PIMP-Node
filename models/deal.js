'use strict';
module.exports = (sequelize, DataTypes) => {
  const deal = sequelize.define('deal', {
    deal_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    shortcode: DataTypes.STRING,
    deal_status_id: DataTypes.INTEGER,
    deal_category_id: DataTypes.INTEGER,
    deal_sub_category_id: DataTypes.INTEGER,
    submit_by_user_id: DataTypes.INTEGER,
    submit_date: DataTypes.DATE,
    approved: DataTypes.BOOLEAN,
    approved_by_user_id: DataTypes.INTEGER,
    approved_date: DataTypes.DATE,
    short_description: DataTypes.STRING(100),
    summary: DataTypes.TEXT,
    investment_amount_sought: DataTypes.STRING,
    minimum_investment: DataTypes.STRING,
    expected_close_date: DataTypes.DATE,
    actual_close_date: DataTypes.DATE,
    deleted: DataTypes.BOOLEAN,
    deleted_by_user_id: DataTypes.INTEGER,
    deleted_datetime: DataTypes.DATE,
    company_name: DataTypes.STRING,
    sponsor_name: DataTypes.STRING,
    location: DataTypes.STRING,
    deal_instrument_id: DataTypes.INTEGER,
    projected_irr: DataTypes.DECIMAL(10, 2),
    projected_multiple: DataTypes.DECIMAL(10, 2),
    referred_by: DataTypes.STRING(50),
    valuation: DataTypes.DECIMAL(10, 2),
    stage: DataTypes.STRING(25),
    deal_contact_name: DataTypes.STRING(50),
    deal_contact_email: DataTypes.STRING(50),
    deal_industry_id: DataTypes.INTEGER,
    deal_profile: DataTypes.TEXT,
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Date.now() },
    updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Date.now() },
  }, {
    freezeTableName: true,
    tableName: 'deal',
    timestamps: false
  });
  deal.associate = function(models) {
    // associations can be defined here
    deal.belongsTo(models.deal_status, {
      foreignKey: {
        name: 'deal_status_id'
      }
    });
    deal.belongsTo(models.deal_category, {
      foreignKey: {
        name: 'deal_category_id'
      }
    });
    deal.belongsTo(models.deal_sub_category, {
      foreignKey: {
        name: 'deal_sub_category_id'
      }
    });
    deal.belongsTo(models.User, {
      foreignKey: {
        name: 'submit_by_user_id',
      }
    });
    deal.belongsTo(models.deal_instrument, {
      foreignKey: {
        name: 'deal_instrument_id',
      }
    });
    deal.belongsTo(models.industry, {
      foreignKey: {
        name: 'deal_industry_id',
      }
    });
    deal.hasMany(models.deal_document, {
      foreignKey: {
        name: 'deal_id'
      }
    });
    deal.hasMany(models.user_deal_interest, {
      foreignKey: {
        name: 'deal_id'
      }
    });
    deal.hasMany(models.user_deal_activity, {
      foreignKey: {
        name: 'deal_id'
      }
    });
    deal.hasMany(models.deal_circle, {
      foreignKey: {
        name: 'deal_id'
      }
    });
  };
  return deal;
};