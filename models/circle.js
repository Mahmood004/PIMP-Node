'use strict';
module.exports = (sequelize, DataTypes) => {
  const circle = sequelize.define('circle', {
    circle_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING,
    shortcode: DataTypes.STRING,
    created_by_user_id: DataTypes.INTEGER,
    active: DataTypes.BOOLEAN,
    private: DataTypes.BOOLEAN,
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Date.now() },
    updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Date.now() },
  }, {
    freezeTableName: true,
    tableName: 'circle',
    timestamps: false
  });
  circle.associate = function(models) {
    // associations can be defined here
    circle.belongsTo(models.User, {
      foreignKey: {
        name: 'created_by_user_id'
      }
    })
  };
  return circle;
};