'use strict';
module.exports = (sequelize, DataTypes) => {
  var Item = sequelize.define('geo_items', {
    name: DataTypes.STRING,
    geom: DataTypes.GEOMETRY('MULTIPOINT')
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Item;
};