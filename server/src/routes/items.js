var express = require('express');
var router = express.Router();
var model = require('../models/index');
const Sequelize = require('sequelize');

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

/* GET heros listing. Called from item.service.ts getItemsWithinBounds()*/
//http://localhost:3000/api/itemsMapBounds?east=-115.13946533203126&west=-115.55042266845705&north=51.12421275782688&south=51.037939894299356
router.get('/itemsMapBounds', function (req, res, next) {
    console.log('itemsMapBounds');
    console.log(req.query);
    var filterString = parseFilterQuery(req.query);

    const query = '\
          SELECT * \
          FROM "geo_items" \
          WHERE ST_Intersects("geom", ST_MakeEnvelope(' + req.query.west + ', \
          ' + req.query.south + ', \
          ' + req.query.east + ', \
          ' + req.query.north + ', 4326))' + filterString;
    
    console.log(query);
    model.sequelize.query(query, {  
        type: Sequelize.QueryTypes.SELECT,
        model: model.geo_items
      }).then(result => {
        res.json(result)
      }).catch(err => {
        console.log('ERROR: ', err)
      });
});

/* get item by id http://localhost:3000/api/heros/1 */
router.get('/items', function (req, res, next) {
    console.log('items');
    console.log(req.query);
    const item_id = req.query.id;
    //console.log(item_id);
    //var filterString = parseFilterQuery(req.query)? ' AND ' + parseFilterQuery(req.query):'';
    //console.log('api - in selected item get by id: ' + filterString);
    
    const query = '\
          SELECT * \
          FROM "geo_items" \
          WHERE "geo_items"."id" = ' + String(item_id);
    
    console.log('api - in selected item get by id: ' + query);
    //http://localhost:3000/api/items/prev?id=7
    model.sequelize.query(query, {  
        type: Sequelize.QueryTypes.SELECT,
        model: model.geo_items
      }).then(result => {
        res.json(result)
      }).catch(err => {
        console.log('ERROR: ', err)
      });


      /*console.log(req.query);
    const item_id = req.query.id;
    console.log('api - in item get by id: ' + String(item_id));
    
    model.geo_items.findAll({
            where: {
                id: item_id
            }
        })
        .then(items => res.json(items))
        .catch(error => res.json({
            error: true,
            error: error
        }));*/
});

// get prev item http://localhost:3000/api/items/prev/5
router.get('/items/prev', function (req, res, next) {
    console.log(req.query);
    const item_id = req.query.id;
    console.log(item_id);
    var filterString = parseFilterQuery(req.query)? parseFilterQuery(req.query):'';
    console.log('api - in prev item get by id: ' + filterString);
    
    
    const query = '\
          SELECT * \
          FROM "geo_items" \
          WHERE ' + filterString 
          + '"geo_items"."id" < ' + String(item_id) + 
          ' ORDER BY "geo_items"."id" DESC LIMIT 1';
    
    console.log('api - in prev item get by id: ' + query);
    //http://localhost:3000/api/items/prev?id=7
    model.sequelize.query(query, {  
        type: Sequelize.QueryTypes.SELECT,
        model: model.geo_items
      }).then(result => {
        res.json(result)
      }).catch(err => {
        console.log('ERROR: ', err)
      });


      /*
    const item_id = req.query.id;
    console.log('api - in prev item get by id: ' + String(item_id));
    
    model.geo_items.findOne({
            where: {
                id: {
                  $lt: item_id
                }
            },
            order: [['id', 'DESC']]
        })
        .then(items => res.json(items))
        .catch(error => res.json({
            error: true,
            error: error
        }));*/
});

// get prev item http://localhost:3000/api/items/prev/5
router.get('/items/next', function (req, res, next) {
    console.log(req.query);
    const item_id = req.query.id;
    console.log(item_id);
    var filterString = parseFilterQuery(req.query)? parseFilterQuery(req.query):'';
    console.log('api - in next item get by id: ' + filterString);
    
    
    const query = '\
          SELECT * \
          FROM "geo_items" \
          WHERE ' + filterString 
          + '"geo_items"."id" > ' + String(item_id) + 
          ' ORDER BY "geo_items"."id" ASC LIMIT 1';
    
    console.log('api - in next item get by id: ' + query);
    //http://localhost:3000/api/items/prev?id=7
    model.sequelize.query(query, {  
        type: Sequelize.QueryTypes.SELECT,
        model: model.geo_items
      }).then(result => {
        res.json(result)
      }).catch(err => {
        console.log('ERROR: ', err)
      });

/*
      console.log(req.query);
    const item_id = req.query.id;
    console.log('api - in next item get by id: ' + String(item_id));
    var filterString = parseFilterQuery(req.query);
    console.log(filterString);
    
    if (req.query.values) {
        model.geo_items.findOne({
            where: {
                id: {
                  $gt: item_id
                },
                itemStatus: {
                    $in: req.query.values
                }
            },
            order: [['id', 'ASC']]
        })
        .then(items => res.json(items))
        .catch(error => res.json({
            error: true,
            error: error
        }));
    }
    else {
        model.geo_items.findOne({
            where: {
                id: {
                  $gt: item_id
                }
            },
            order: [['id', 'ASC']]
        })
        .then(items => res.json(items))
        .catch(error => res.json({
            error: true,
            error: error
        }));
    }*/
});
// GET all items and search for items 
router.get('/items', function (req, res, next) {
    console.log('items');
    const filter = req.query.name;
    console.log(JSON.stringify(req.params));
    model.geo_items.findAll({

        where: { 
            name: { $like: '%'+filter+'%' } 
        }
    })
        
        .then(items => res.json(items))
        
        .catch(error => res.json({
            error: true,
            data: [],
            error: error
        }));
});

/* POST/add new item. */
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

/* PUT/update item. */
router.put('/items/:id', function (req, res, next) {

    const item_id = req.params.id;
    console.log('saving ' + String(item_id));
    const { name } = req.body;
    console.log('NAME ' + JSON.stringify(req.body));
    
    model.geo_items.update({
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

// GET all items 
router.get('/item_status', function (req, res, next) {
    console.log(req.params);
    model.item_status.findAll({})
        
        .then(items => res.json(items))
        
        .catch(error => res.json({
            error: true,
            data: [],
            error: error
        }));
});

// GET distinct values in column for filtering
router.get('/filters/:col', function (req, res, next) {
    console.log(req.params); //SELECT DISTINCT "itemStatus" FROM geo_items
    const columnName = req.params.col;
    var distinct = model.Sequelize.fn('DISTINCT', model.sequelize.col(columnName));
    
    model.geo_items.findAll({
        attributes: [[model.sequelize.fn('DISTINCT', model.sequelize.col(columnName)), 'filter']]
    })
        
        .then(items => res.json(items))
        
        .catch(error => res.json({
            error: true,
            data: [],
            error: error
        }));
});

function parseFilterQuery(params) {
    /*
    { east: '-115.22495269775392',
      west: '-115.4652786254883',
      north: '51.12421275782688',
      south: '51.037939894299356',
      filtercol: [ 'itemStatus', 'imgStatus' ],
      values: [ '"\'deleted\',\'loaded\',\'verified\'', '"\'bad\',\'good\'' ] 
    }
*/
    var filterString = '';
    console.log(params);
    if (params.filtercol) {
        //console.log('in filter query prep');
        
        for (var i = 0; i < params.filtercol.length; i++) {
          var column = '"geo_items".' + '"' +params.filtercol[i] + '"';
          var curvals = params.values[i];
          var values = ' IN ('+ curvals + ')';
          filterString = filterString + column + values + ' AND ';
        }

        filterString = " AND " + filterString.slice(0,-4);
    }
    return filterString; //remove the ast AND 
}

module.exports = router;