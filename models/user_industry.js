'use strict';
module.exports = (sequelize, DataTypes) => {
  const user_industry = sequelize.define('user_industry', {
    user_industry_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: DataTypes.INTEGER,
    industry_id: DataTypes.INTEGER,
    relationship_type: DataTypes.STRING,
    date_added: DataTypes.DATE,
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Date.now() },
    updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Date.now() },
  }, {
    freezeTableName: true,
    tableName: 'user_industry',
    timestamps: false
  });
  user_industry.associate = function(models) {
    // associations can be defined here
    user_industry.belongsTo(models.industry, {
      foreignKey: {
        name: 'industry_id'
      }
    })
  };
  return user_industry;
};