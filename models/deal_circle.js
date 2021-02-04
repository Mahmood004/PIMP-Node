'use strict';
module.exports = (sequelize, DataTypes) => {
  const deal_circle = sequelize.define('deal_circle', {
    deal_circle_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    deal_id: DataTypes.INTEGER,
    circle_id: DataTypes.INTEGER,
    added_by_user_id: DataTypes.INTEGER,
    date_added: DataTypes.DATE,
    active: DataTypes.BOOLEAN,
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Date.now() },
    updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Date.now() },
  }, {
    freezeTableName: true,
    tableName: 'deal_circle',
    timestamps: false
  });
  deal_circle.associate = function(models) {
    // associations can be defined here
    deal_circle.belongsTo(models.deal, {
      foreignKey: {
        name: 'deal_id'
      }
    });
    deal_circle.belongsTo(models.circle, {
      foreignKey: {
        name: 'circle_id'
      }
    });
    deal_circle.belongsTo(models.User, {
      foreignKey: {
        name: 'added_by_user_id'
      }
    });
  };
  return deal_circle;
};