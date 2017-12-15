var express = require('express');
var router = express.Router();
var model = require('../models/index');
const Sequelize = require('sequelize');
//const Op = Sequelize.Op;

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
//http://localhost:3000/api/herosall?east=-115.13946533203126&west=-115.55042266845705&north=51.12421275782688&south=51.037939894299356
router.get('/itemsall', function (req, res, next) {
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

/* get hero by id http://localhost:3000/api/heros/1 */
router.get('/items/:id', function (req, res, next) {

    const item_id = req.params.id;
    console.log('api - in item get by id');
    console.log(item_id);
    const { name } = req.body;
    
    model.geo_items.findAll({
            where: {
                id: item_id
            }
        })
        .then(items => res.json(items))
        .catch(error => res.json({
            error: true,
            error: error
        }));
        
});

/* GET items listing within map bounds. 
router.get('/', function (req, res, next) {
    console.log('i am in router.get with extents ');
    console.log(req.params);
    model.items.findAll({})
        
        .then(items => res.json(items))
        
        .catch(error => res.json({
            error: true,
            data: [],
            error: error
        }));
});
*/

/* POST item. */
router.post('/', function (req, res, next) {
    const {
        name
    } = req.body;
    model.Items.create({
            name: name
        })
        .then(item => res.status(201).json({
            error: false,
            data: item,
            message: 'New item has been created.'
        }))
        .catch(error => res.json({
            error: true,
            data: [],
            error: error
        }));
});


/* update item. */
router.put('/:id', function (req, res, next) {

    const item_id = req.params.id;
    console.log(item_id);
    const { name } = req.body;

    model.Items.update({
            name: name
        }, {
            where: {
                id: item_id
            }
        })
        .then(item => res.status(201).json({
            error: false,
            message: 'item has been updated.'
        }))
        .catch(error => res.json({
            error: true,
            error: error
        }));
});

/* Delete item. */
router.delete('/:id', function (req, res, next) {
    const item_id = req.params.id;

    model.Items.destroy({ where: {
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