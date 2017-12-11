import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

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

  map_info = {
      //bounds: 'Point',
      //maxZoom: 12,
      //markers: this.markerClusterData
  };

   // Generators for lat/lon values
  generateLat() { return Math.random() * 360 - 180; }
  generateLon() { return Math.random() * 180 - 90; }

  ngOnInit() {
    //this.getItems();  
  }

  markerClusterReady(group: L.MarkerClusterGroup) {
    this.markerClusterGroup = group;
  }

  onMapReady(map: L.Map) {
    map.on('moveend', () => {
      // Do stuff with changed bounds
      var bounds = map.getBounds();
      console.log(bounds);
      this.map_info = {
        zoom: 12,
        extents: {
          east: map.getBounds().getEast(), 
          west: map.getBounds().getWest(),
          north: map.getBounds().getNorth(),
          south: map.getBounds().getSouth()
        }
      };
      //var east = map.getBounds().getEast();//
      //ar west = map.getBounds().getWest();
      //var north = map.getBounds().getNorth();
      //var south = map.getBounds().getSouth();

      console.log('east: '+ JSON.stringify(this.map_info));
      
    });
    this.getItems(); 
  }

  //gave the HeroService get data method an asynchronous signature.
  getItems(): void {

    this.heroService.getHeroes() //returns an Observable<Hero[]> so that we can return an asynchronous list of heroes
        .subscribe((heroes: Hero[]) => {

            // do stuff with our data here.
            const data: any[] = [];
            const icon = L.icon({
              iconUrl: 'assets/images/marker-shadow.png', 
              shadowUrl: 'assets/images/marker-icon.png' 
            });
            //console.log(heroes);
            heroes.map(hero => {
              console.log(hero)
              data.push(L.marker([ this.generateLon(), this.generateLat() ], { icon }));
              //console.log(this.generateLon());
            });
            // asign data to our class property in the end
            // so it will be available to our template
            //this.heroes = heroes//.heroes
            this.markerClusterData = data;
        })
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


