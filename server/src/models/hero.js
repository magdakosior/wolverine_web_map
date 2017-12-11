'use strict';
module.exports = (sequelize, DataTypes) => {
  var Hero = sequelize.define('heros', {
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Hero;
};