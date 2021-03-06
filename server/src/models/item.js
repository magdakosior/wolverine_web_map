'use strict';
module.exports = (sequelize, DataTypes) => {
  var Item = sequelize.define('photos', {
    importid: DataTypes.STRING,
    geom: DataTypes.GEOMETRY('MULTIPOINT'),
    path: DataTypes.STRING,
    photopath: DataTypes.STRING,
    datetaken: DataTypes.DATE,
    temperature: DataTypes.NUMERIC,
    session: DataTypes.STRING,
    itemstatus: {
      type: DataTypes.STRING,
      values: ['loaded', 'verified', 'deleted']
    },
    specieswolv: DataTypes.BOOLEAN,
    speciesother: {
      type: DataTypes.STRING,
      values: ['squirrel', 'moose', 'other']
    },
    numanimals: DataTypes.NUMERIC,
    age: DataTypes.NUMERIC,
    sex: DataTypes.STRING,
    behaviour: DataTypes.STRING,
    indivname: DataTypes.STRING,
    vischest: DataTypes.BOOLEAN,
    vislactation: DataTypes.BOOLEAN,
    vissex: DataTypes.BOOLEAN,
    visbait: DataTypes.BOOLEAN,
    removedbait: DataTypes.BOOLEAN,
    daterembait: DataTypes.DATE,
    checkcamera: DataTypes.BOOLEAN,
    marker: DataTypes.BOOLEAN,
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