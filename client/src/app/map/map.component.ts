import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

//@Component is a decorator function that specifies the Angular metadata for the component.
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  
  heroes: Hero[]; //heroes service to expose these heroes for binding
  //used Angular Dependency Injection to inject it into a component
  constructor(private heroService: HeroService) { }
  
  // Open Street Map Definition
  LAYER_OSM = {
    id: 'openstreetmap',
    name: 'Open Street Map',
    enabled: false,
    layer: L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 12,
      attribution: 'Open Street Map'
    })
  };

  // Values to bind to Leaflet Directive
  layersControlOptions = { position: 'bottomright' };
  baseLayers = {
    'Open Street Map': this.LAYER_OSM.layer
  };
  options = {
    zoom: 12,
    center: L.latLng([ 51.0810, -115.3451 ])
  };

  // Marker cluster stuff
  markerClusterGroup: L.MarkerClusterGroup;
  markerClusterData: any[] = [];
  markerClusterOptions: L.MarkerClusterGroupOptions;

  map: L.Map;
  //not sure how to initialize this!!
  map_info = {
      zoom: 12,
      extents: {
        east:-115.13946533203126,
        west:-115.55042266845705,
        north:51.12421275782688,
        south:51.037939894299356
      },
      markers:[]
  };

   // Generators for lat/lon values
  generateLat() { return Math.random() * 360 - 180; }
  generateLon() { return Math.random() * 180 - 90; }

  ngOnInit() {
    console.log('ngOnInit');
    this.getItems();  
    //console.log(this.map_info);
  }

  markerClusterReady(group: L.MarkerClusterGroup) {
    this.markerClusterGroup = group;
  }

  onMapReady(map: L.Map) {
    console.log('onMapReady');
    map.on('moveend', () => {
      // Do stuff with changed bounds
      this.map_info.extents.east = map.getBounds().getEast();
      this.map_info.extents.west = map.getBounds().getWest();
      this.map_info.extents.north = map.getBounds().getNorth();
      this.map_info.extents.south = map.getBounds().getSouth();
      
      console.log('moved extents: '+ JSON.stringify(this.map_info));
      this.getItems(); 
    });
    //this.getItems(); 
  }

  //gave the HeroService get data method an asynchronous signature.
  getItems(): void {
    console.log('getItems');
    //console.log(JSON.stringify(this.map_info));
    var coords = '?east=' + String(this.map_info.extents.east) + '&west=' + String(this.map_info.extents.west) + '&north=' + String(this.map_info.extents.north) + '&south=' + String(this.map_info.extents.south);
    //var coords = '?extend='+ this.map_info;
    
    this.heroService.getHeroesWithinBounds(coords) 
      .subscribe(
        (markers: any) => {
            //this.map_info.markers = markers;
            //console.log('in get Heros within Bounds function');
            //console.log(markers);

            const map_markers: any[] = [];
            
            for (let i = 0; i < Object.keys(markers).length; i++) {

              const icon = L.icon({
                iconUrl: 'assets/images/marker-icon.png',
                shadowUrl: 'assets/images/marker-shadow.png'
              });
              console.log(i);
              console.log(markers[i].geom.coordinates[0][0] + ', ' + markers[i].geom.coordinates[0][1]);
              map_markers.push(L.marker([ markers[i].geom.coordinates[0][1], markers[i].geom.coordinates[0][0] ], { icon }));
            }

            this.markerClusterData = map_markers;
        },
        err => console.log(err), // error
        () => console.log('getItems Complete') // complete
      );
  }

  getMapBounds(): void {
    /*
    map.on('dragend', function onDragEnd(){
      var width = map.getBounds().getEast() - map.getBounds().getWest();
      var height = map.getBounds().getNorth() - map.getBounds().getSouth();

      alert (
          'center:' + map.getCenter() +'\n'+
          'width:' + width +'\n'+
          'height:' + height +'\n'+
          'size in pixels:' + map.getSize()
    )});
    */

    //map.on('moveend', function() { 
    // alert(map.getBounds());
    //});
/*
    var b = map.getBounds();
    var b1 = {
        "trlat": b.getNorthWest().lat,
        "trlon": b.getNorthWest().lng, 
        "bllat": b.getSouthEast().lat, 
        "bllon": b.getSouthEast().lng
    }
    //Get the zoom level
    var zoom = 3;
    if(map.getZoom() >= 5 && map.getZoom() <= 8){
        zoom =4;
    }
    else if(map.getZoom() >= 9 && map.getZoom() <= 11){
        zoom =5;
    }
    else if(map.getZoom() >= 12 && map.getZoom() <= 14){
        zoom =6;
    }
    else if(map.getZoom() >= 15 && map.getZoom() <= 17){
        zoom =7;
    }
    else if(map.getZoom() >= 18){
        zoom =8;
    }
    //making elastic api call via parse visit https://parse.com/
    var d = {
            "bounds": b1,
            "zoom": zoom
          };
    Parse.initialize("OjImjwifOD5EladE5585UAS3CJGy7ednZjucd5SE", "6CE4fybH3Cg4fiqbvxsAE8osmX6MsEIWou0Kudr9");
    Parse.Cloud.run('search', d, {
      success: function(resp) {
        markers.clearLayers();
        var r = JSON.parse(resp)
        //makes the points as returned by the server.
        getItems(r.aggregations.zoom.buckets);
      },
      error: function(error) {
        console.log(error)
      }
    });*/
  }
  
}


