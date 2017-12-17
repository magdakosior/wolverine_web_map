'use strict';
module.exports = (sequelize, DataTypes) => {
  var ItemStatus = sequelize.define('item_status', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      values: ['loaded', 'verified', 'deleted']

    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        //Item.hasMany(models.ItemStatus);
      }
    }
  });
  return ItemStatus;
};