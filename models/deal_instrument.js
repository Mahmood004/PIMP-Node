'use strict';
module.exports = (sequelize, DataTypes) => {
  const deal_instrument = sequelize.define('deal_instrument', {
    deal_instrument_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING,
    active: DataTypes.BOOLEAN
  }, {
    freezeTableName: true,
    tableName: 'deal_instrument',
    underscored: true,
  });
  deal_instrument.associate = function(models) {
    // associations can be defined here
  };
  return deal_instrument;
};