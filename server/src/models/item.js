'use strict';
module.exports = (sequelize, DataTypes) => {
  var Item = sequelize.define('geo_items', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    name: DataTypes.STRING,
    geom: DataTypes.GEOMETRY('MULTIPOINT'),
    photoPath: DataTypes.STRING,
    itemStatus: {
      type: DataTypes.STRING,
      values: ['loaded', 'verified', 'deleted']

    },
    imgStatus: {
      type: DataTypes.STRING,
      values: ['tummy', 'good', 'bad']

    },
    createdAt:  DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        //Item.hasMany(models.ItemStatus);
      }
    }
  });
  return Item;
};