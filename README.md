

 

 package.json scripts
 	"start": "node ./server/src/bin/www"


    "ng": "ng",
    "start": "ng serve --proxy-config proxy.config.json",
    "build": "ng build",
    "test": "ng test",
    "lint": "ng lint",
    "e2e": "ng e2e",
    "start": "gulp && concurrently \"gulp watch\" \"nodemon server/app/server.js\""




    ng build --watch from root will run client and watch for changes




    Making tiles
    The MBTiles file you've generated has all our imagery packed into it, but now we need to convert them to PNG. To do so, we can use a handy library called mbutil which is capable of converting MBTiles to PNG.

Download and install mbutil: 
git clone git://github.com/mapbox/mbutil.git
sudo python setup.py install
mb-util -h to verify it worked.
Convert the tiles using the following command: 
mb-util --image_format=png DavidsMap.mbtiles DavidsMap
It will generate a folder, in my case DavidsMap, which will contain all of your map tiles in PNG format.