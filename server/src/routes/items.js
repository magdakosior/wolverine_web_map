var express = require('express');
var router = express.Router();
var model = require('../models/index');
const Sequelize = require('sequelize');
var fs = require('fs');
var path = require('path');
var ExifImage = require('exif').ExifImage;
var dms = require("dms-conversion");

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

/* load file http://localhost:3000/api/info */
router.get('/info', function (req, res, next) {
    console.log('info');
    var jsondata = JSON.parse(req.query.data);
    
    var response = {}
    var photoList = [];

    fs.readdir(jsondata.path, function(err, items) {     
        //for each file in directory
        for (var i=0; i<items.length; i++) { 
            var photoObj = {};
            photoObj.path = path.join(jsondata.path, items[i]);
            photoObj.session = jsondata.session;
            //store default info file location
            //console.log(jsondata.location);
            photoObj.lat = jsondata.lat;
            photoObj.lon = jsondata.lon;
            photoList.push(photoObj);
        }
        processExifInfo(photoList, function (resultList) { 
            console.log('saving list to DB'); 
            //console.log(photoList);
            var score = 0;
            for (var i = 0; i< resultList.length; i++) {
                //console.log(photoList[i]);
                addItem(resultList[i], function (result) {
                    //console.log('added item to DB');
                    score = score +1; 
                    console.log(score);
                    //add something here to say which ones were not added
                    response.result = result.message;
                    if (score == resultList.length) {
                        res.json(response);
                        console.log(response.result);
                    }
                });
            }
            //response.result = 'Data loaded sucessfully';
            //console.log(response.result);
            //res.json(response.result);
        })


    }); //end fs read

    //response.error = 'Could not load data';
    //response.reason = 'no files found in ' + jsondata.folderPath;
    //res.json(response)
});

/* GET heros listing. Called from item.service.ts getItemsWithinBounds()*/
//http://localhost:3000/api/itemsMapBounds?east=-115.13946533203126&west=-115.55042266845705&north=51.12421275782688&south=51.037939894299356
router.get('/itemsMapBounds', function (req, res, next) {
    console.log('itemsMapBounds');
    console.log(req.query);
    var filterString = parseFilterQuery(req.query);
    console.log('------->');
    console.log(filterString);
    
    const query = '\
          SELECT * \
          FROM "photos" \
          WHERE ST_Intersects("geom", ST_MakeEnvelope(' + req.query.west + ', \
          ' + req.query.south + ', \
          ' + req.query.east + ', \
          ' + req.query.north + ', 4326))' + filterString;
    
    console.log('------->');
    console.log(query);
    model.sequelize.query(query, {  
        type: Sequelize.QueryTypes.SELECT,
        model: model.photos
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
          FROM "photos" \
          WHERE "photos"."id" = ' + String(item_id);
    
    console.log('api - in selected item get by id: ' + query);
    //http://localhost:3000/api/items/prev?id=7
    model.sequelize.query(query, {  
        type: Sequelize.QueryTypes.SELECT,
        model: model.photos
      }).then(result => {
        res.json(result)
      }).catch(err => {
        console.log('ERROR: ', err)
      });


      /*console.log(req.query);
    const item_id = req.query.id;
    console.log('api - in item get by id: ' + String(item_id));
    
    model.photos.findAll({
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
    console.log('/items/prev');
    console.log(req.query);
    var filterString = parseFilterQuery(req.query);
    console.log('------->');

    const item_id = req.query.id;
    
    const query = '\
          SELECT * \
          FROM "photos" \
          WHERE "photos"."id" < ' + String(item_id) + 
          filterString +  
          ' ORDER BY "photos"."id" DESC LIMIT 1';
    
    console.log(query);
    //http://localhost:3000/api/items/prev?id=7
    model.sequelize.query(query, {  
        type: Sequelize.QueryTypes.SELECT,
        model: model.photos
      }).then(result => {
        res.json(result)
      }).catch(err => {
        console.log('ERROR: ', err)
      });


      /*
    const item_id = req.query.id;
    console.log('api - in prev item get by id: ' + String(item_id));
    
    model.photos.findOne({
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
    console.log('/items/next');
    console.log(req.query);
    var filterString = parseFilterQuery(req.query);
    console.log('------->');

    const item_id = req.query.id;
    const query = '\
          SELECT * \
          FROM "photos" \
          WHERE "photos"."id" > ' + String(item_id) +
          filterString +  
          ' ORDER BY "photos"."id" ASC LIMIT 1';
    
    console.log(query);
    //http://localhost:3000/api/items/prev?id=7
    model.sequelize.query(query, {  
        type: Sequelize.QueryTypes.SELECT,
        model: model.photos
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
        model.photos.findOne({
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
        model.photos.findOne({
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
    model.photos.findAll({

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
router.post('/item', function (req, res, next) {
    console.log('in items post');
    const {
        name
    } = req.body;

    console.log(req.body);
    
    model.photos.create({
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
    
    model.photos.update({
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
    console.log(req.params); //SELECT DISTINCT "itemStatus" FROM photos
    const columnName = req.params.col;
    var distinct = model.Sequelize.fn('DISTINCT', model.sequelize.col(columnName));
    
    model.photos.findAll({
        attributes: [[model.sequelize.fn('DISTINCT', model.sequelize.col(columnName)), 'filter']]
    })
        
        .then(items => res.json(items))
        
        .catch(error => res.json({
            error: true,
            data: [],
            error: error
        }));
});

function addItem(params, callback) {
    console.log(';--------add item-------------');
    var point = { 
      type: 'MultiPoint', 
      coordinates: [[params.lon, params.lat]],
      crs: { type: 'name', properties: { name: 'EPSG:4326'} }
    };

    //console.log(params.dateTaken.replace(':','-').replace(':','-'));
    var pattern = '/assets';
    params.photopath = params.path.substr(params.path.indexOf(pattern), params.path.length);
    console.log(params.photopath);

    model.photos.create({
            geom: point,
            path: params.path,
            photopath: params.photopath,
            datetaken: params.dateTaken.replace(':','-').replace(':','-'),
            temperature: null,
            session: params.session,
            itemstatus: 'loaded',
            specieswolv: null,
            speciesother: null,
            numanimals: null,
            age: null,
            sex: null,
            behaviour: null,
            indivname: null,
            vischest: null,
            vislactation: null,
            vissex: null,
            visbait: null,
            removedbait: null,
            daterembait: null,
            checkcamera: null
        })
        .then(item => callback({
            error: false,
            //data: item,
            message: 'New items have been added to the DB.'
        }))
        .catch(error => callback({
            error: true,
            data: [],
            error: error
        }));
        
/*
    //console.log(params);
    const query = '\
          INSERT INTO "photos" \
          ("name", \
          "photoPath", \
          "dateTaken" \
          ) VALUES (\'' + params.session + '\',\'' +
          params.path + '\',\'' +
          params.dateTaken.replace(':','-').replace(':','-') + '\')';
    
    console.log(query);

    
    model.sequelize.query(query, {  
        type: Sequelize.QueryTypes.SELECT,
        model: model.photos
      }).then(result => {
        callback(result)
      }).catch(err => {
        callback('ERROR: query did not go through .  '+ query)
      });
      */
}

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
    var column = '';
    var values = '';
    var curvals = [];
    var filteritem = [];

    if (params.filtercol) {
        
        //1 column
        if (typeof(params.filtercol)=='string') {

            column = '"photos".' + '"' +params.filtercol + '"';
            //1 value
            if (typeof(params.values)=='string') {
                values = ' IN ('+ params.values + ')';
                filteritem.push(column + values);
            }
        }
        else { //more than 1 column
            for (var i = 0; i < params.filtercol.length; i++) {
                column = '"photos".' + '"' +params.filtercol[i] + '"';
                values = ' IN ('+ params.values[i] + ')';
                filteritem.push(column + values);
            }
        }

        filteritem = filteritem.join(' AND ');
        //console.log(filteritem);
        if (filteritem)
            filterString = ' AND ' + filteritem;
        else
            filteritem = '';
    }
    return filterString;
}

function processExifInfo(v1photoList, callback) {
    var itemsProcessed = 0;
    var photoList = [];
    
    try {  
        v1photoList.forEach((item, index, array) => {
            
            new ExifImage({ image : item.path }, function (error, exifData) {
                if (error || item.path.endsWith('.DS_Store')) {
                    console.log('Error1: '+error.message);
                }
                else {
                    if (exifData.gps.GPSLatitude && exifData.gps.GPSLongitude) {
                        //gps:
                        //{ GPSLatitudeRef: 'N',
                        //  GPSLatitude: [ 51, 3, 15 ],
                        //[ GPSLongitudeRef: 'W',
                        //  GPSLongitude: [ 115, 19, 24 ] }
                        var lat = exifData.gps.GPSLatitude;
                        var lon = exifData.gps.GPSLongitude;
                        var dmsStrings = [lat[0] + '°' + lat[1] + '′' + lat[2] + "″ N",lon[0]+'°'+lon[1]+'′'+ lon[2]+ "″ W"];
                        var dmsCoords = dmsStrings.map(dms.parseDms); // [-122.902336120571, 46.9845854731319] 
                        item.lat = dmsCoords[0];
                        item.lon = dmsCoords[1];
                        console.log(dmsCoords);
                    }
                    if (exifData.exif) {
                        item.dateTaken = exifData.exif.DateTimeOriginal;  //capture date taken
                    }
                    photoList.push(item);
                }
                
                itemsProcessed++;
                //return the items back to previous function where it was called from
                if(itemsProcessed === array.length) {
                    callback(photoList);
                }
            });
        });      
    } catch (error) {
        console.log('Error2: ' + error.message);
    }
}
module.exports = router;