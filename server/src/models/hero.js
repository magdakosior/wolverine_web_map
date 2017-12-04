'use strict';
module.exports = (sequelize, DataTypes) => {
  var Hero = sequelize.define('Heros', {
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