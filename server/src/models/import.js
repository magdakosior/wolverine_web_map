'use strict';
module.exports = (sequelize, DataTypes) => {
  var Import = sequelize.define('imports', {
    importid: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        //Item.hasMany(models.ItemStatus);
      }
    }
  });
  return Import;
};