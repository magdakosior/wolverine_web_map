import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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
  
  @Output() markerClick = new EventEmitter();
  message: string = "Hola Mundo!"

  // Open Street Map Definition
  LAYER_OSM = {
    id: 'openstreetmap',
    name: 'Open Street Map',
    enabled: false,
    layer: L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 20,
      minZoom: 3,
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

  //markers = L.markerClusterGroup({ spiderfyOnMaxZoom: false, showCoverageOnHover: false, zoomToBoundsOnClick: false });

  // Marker cluster stuff
  markerClusterGroup: L.MarkerClusterGroup;
  markerClusterData: any[] = [];
  markerClusterOptions: L.MarkerClusterGroupOptions;

  //https://github.com/DefinitelyTyped/DefinitelyTyped/blob/617fc60898e7671653ddb269561f41260b2d80a7/types/leaflet.markercluster.layersupport/leaflet.markercluster.layersupport-tests.ts

  //this.markerClusterGroup = { spiderfyOnMaxZoom: false, showCoverageOnHover: false, zoomToBoundsOnClick: false }

  map: L.Map;
  //not sure how to initialize this!!
  map_info = {
    zoom: 16,
    extents: {
      east:-115.13946533203126,
      west:-115.55042266845705,
      north:51.12421275782688,
      south:51.037939894299356
    },
    curr_marker: {
      id: 1
    }
  };

  ngOnInit() {
    this.getItems();  
  }

  markerClusterReady(group: L.MarkerClusterGroup) {
    this.markerClusterGroup = group;
  }

  onMapReady(map: L.Map) {
    map.on('moveend', () => {
      this.map_info.zoom = map.getZoom();
      this.map_info.extents.east = map.getBounds().getEast();
      this.map_info.extents.west = map.getBounds().getWest();
      this.map_info.extents.north = map.getBounds().getNorth();
      this.map_info.extents.south = map.getBounds().getSouth();
      //console.log('moved extents: '+ JSON.stringify(this.map_info));
      this.getItems(); 
      //console.log(this.map_info.zoom);
    });
  }

  //gave the HeroService get data method an asynchronous signature.
  getItems(): void {
    var coords = '?east=' + String(this.map_info.extents.east) + '&west=' + String(this.map_info.extents.west) + '&north=' + String(this.map_info.extents.north) + '&south=' + String(this.map_info.extents.south);
    //console.log(this.map_info.curr_marker);
    this.heroService.getHeroesWithinBounds(coords) 
      .subscribe(
        (markers: any) => {
            console.log(markers);
            //console.log(this.map_info.curr_marker);
            var map_markers: any[] = [];
            
            for (let i = 0; i < Object.keys(markers).length; i++) {
              const icon = L.icon({
                iconUrl: 'assets/images/marker-icon.png',
                shadowUrl: 'assets/images/marker-shadow.png'
              });
              //console.log(i);
              //console.log(markers[i].geom.coordinates[0][0] + ', ' + markers[i].geom.coordinates[0][1]);
              var addmarker = L.marker([ markers[i].geom.coordinates[0][1], markers[i].geom.coordinates[0][0] ], { icon })
                .on({
                    'click': event => this.markerClick.emit(markers[i].id)//markers[i].id
                });
                /*
                .on('click', function(e: MouseEvent){
                    //figure out how to make marker red?! and send details or id to another component
                    //map_info.curr_marker = markers[i].id;
                    //var clickedMarker = event.name;
                    const redicon = L.icon({
                      iconUrl: 'assets/images/red-map-marker.png',
                      shadowUrl: 'assets/images/marker-shadow.png'
                    });
                    console.log(markers[i].id);
                    //e.target.setIcon(redicon);
                    this.click.emit(event)
                    //console.log(this.map_info);;
                    
                  });*/

              map_markers.push(addmarker);
            }
            this.markerClusterData = map_markers;

            //var visibleOne = this.markerClusterGroup.getVisibleParent(myMarker);
            //console.log(visibleOne.getLatLng());
        },
        err => console.log(err), // error
        () => console.log('getItems Complete') // complete
      );
  }

  getHandlerForFeature(feat) {  
      return function(ev) {   // ...that returns a function...
          console.log(feat);  // ...that has a closure over the value.
      }
  } 

  getMapBounds(): void {

  }
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


