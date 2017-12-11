var express = require('express');
var router = express.Router();
var model = require('../models/index');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const operatorsAliases = {
    $eq: Op.eq,
    $or: Op.or,
}
//middleware to hanlde errors 
const awaitErorrHandlerFactory = middleware => {
  return async (req, res, next) => {
    try {
      await middleware(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};

/* GET heros listing. */
router.get('/', function (req, res, next) {
    //console.log(req.query.east);

    var envelope = model.Sequelize.fn('ST_MakeEnvelope', req.query.west, req.query.south, req.query.east, req.query.north, 4326);
    var intersects = model.Sequelize.fn('ST_Intersects', model.Sequelize.col('geom'), envelope);

    model.geo_items.findAll({
        where: intersects
    })        
        /*.then(heros => res.json({
            error: false,
            data: heros
        }
        ))*/
        .then(items => res.json(items))
        .catch(error => res.json({
            error: true,
            data: [],
            error: error
        }));
});

/* GET heros listing within map bounds. 
router.get('/', function (req, res, next) {
    console.log('i am in router.get with extents ');
    console.log(req.params);
    model.heros.findAll({})
        
        .then(heros => res.json(heros))
        
        .catch(error => res.json({
            error: true,
            data: [],
            error: error
        }));
});
*/

/* POST hero. */
router.post('/', function (req, res, next) {
    const {
        name
    } = req.body;
    model.Heros.create({
            name: name
        })
        .then(hero => res.status(201).json({
            error: false,
            data: hero,
            message: 'New hero has been created.'
        }))
        .catch(error => res.json({
            error: true,
            data: [],
            error: error
        }));
});


/* update hero. */
router.put('/:id', function (req, res, next) {

    const hero_id = req.params.id;

    const { name } = req.body;

    model.Heros.update({
            name: name
        }, {
            where: {
                id: hero_id
            }
        })
        .then(hero => res.status(201).json({
            error: false,
            message: 'hero has been updated.'
        }))
        .catch(error => res.json({
            error: true,
            error: error
        }));
});

/* Delete hero. */
router.delete('/:id', function (req, res, next) {
    const hero_id = req.params.id;

    model.Heros.destroy({ where: {
        id: hero_id
    }})
        .then(status => res.status(201).json({
            error: false,
            message: 'hero has been delete.'
        }))
        .catch(error => res.json({
            error: true,
            error: error
        }));
});

module.exports = router;