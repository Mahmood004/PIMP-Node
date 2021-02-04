'use strict';
module.exports = (sequelize, DataTypes) => {
  const deal_document = sequelize.define('deal_document', {
    deal_document_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    deal_id: DataTypes.INTEGER,
    file_name: DataTypes.STRING,
    file_type: DataTypes.STRING,
    submit_date: DataTypes.DATE,
    submit_by_user_id: DataTypes.INTEGER,
    file_size: DataTypes.STRING,
    storage_location: DataTypes.STRING,
    short_description: DataTypes.STRING(100),
    deleted: DataTypes.BOOLEAN,
    deleted_by_user_id: DataTypes.INTEGER,
    deleted_datetime: DataTypes.DATE,
    private: DataTypes.BOOLEAN,
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Date.now() },
    updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Date.now() },
  }, {
    freezeTableName: true,
    tableName: 'deal_document',
    timestamps: false
  });
  deal_document.associate = function(models) {
    // associations can be defined here
    deal_document.belongsTo(models.deal, {
      foreignKey: {
        name: 'deal_id'
      }
    }),
    deal_document.belongsTo(models.User, {
      foreignKey: {
        name: 'submit_by_user_id'
      }
    })
  };
  return deal_document;
};