import { Component, OnInit, Output, EventEmitter, OnChanges } from '@angular/core';
import * as L from 'leaflet';

import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

//import { Hero } from '../hero';
import { ItemService } from '../item.service';

//@Component is a decorator function that specifies the Angular metadata for the component.
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnChanges {
  
  //heroes: Hero[]; //heroes service to expose these heroes for binding
  //used Angular Dependency Injection to inject it into a component
  constructor(private itemService: ItemService) { }//
  
  @Output() markerClick = new EventEmitter();
  
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

  // Marker cluster stuff
  markerClusterGroup: L.MarkerClusterGroup;
  markerClusterData: any[] = [];
  markerClusterOptions: L.MarkerClusterGroupOptions;

  //not sure how to initialize this!!
  map_info = {
    zoom: 16,
    extents: {
      east:-115.13946533203126,
      west:-115.55042266845705,
      north:51.12421275782688,
      south:51.037939894299356
    }
  };

  customMarker = L.Marker.extend({
    options: { 
      id: 0
   }
  });
  selectedMarker = new this.customMarker();
  
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
      this.getItems(); 
    });
  }

  //gave the HeroService get data method an asynchronous signature.
  getItems(): void {
    const redIcon = L.icon({
      iconUrl: 'assets/images/red-map-marker.png',
      shadowUrl: 'assets/images/marker-shadow.png'
    });
    const blueIcon = L.icon({
      iconUrl: 'assets/images/marker-icon.png',
      shadowUrl: 'assets/images/marker-shadow.png'
    });

    var coords = '?east=' + String(this.map_info.extents.east) + '&west=' + String(this.map_info.extents.west) + '&north=' + String(this.map_info.extents.north) + '&south=' + String(this.map_info.extents.south);
    
    this.itemService.getItemsWithinBounds(coords) 
      .subscribe(
        (items: any) => {
            var map_items: any[] = [];

            for (let i = 0; i < Object.keys(items).length; i++) {
              //console.log(items[i]);
              var lat = items[i].geom.coordinates[0][1];
              var lon = items[i].geom.coordinates[0][0];
              var id = items[i].id;

              var addmarker = new this.customMarker([ lat, lon ], { icon: blueIcon, id: id})
                .on({
                    'click': event => {
                      this.markerClick.emit(parseInt(items[i].id));

                      if(this.selectedMarker.options.id != 0) {  //if marker is set
                        if(this.selectedMarker != event.target) {
                            //console.log('clean old selection');
                            //console.log(this.selectedMarker);
                            this.selectedMarker.setIcon(blueIcon);
                            //console.log(this.selectedMarker);
                            
                            //console.log('change selection');
                            this.selectedMarker = event.target;
                            this.selectedMarker.setIcon(redIcon);
                        }
                      }
                      else { //marker has not been set
                        //console.log('new selected marker ' + parseInt(items[i].id));
                        this.selectedMarker = event.target;
                        this.selectedMarker.setIcon(redIcon); //set highlight icon
                        //console.log(this.selectedMarker);
                      }
                    }
                });
                
              if (this.selectedMarker.options.id == addmarker.options.id) {
                //console.log(String (this.selectedMarker.options.id) + ' found a match with ' + String(addmarker.options.id));
                addmarker.setIcon(redIcon);
                this.selectedMarker = addmarker;
                //console.log(this.selectedMarker);  //lost map info here
              }
              map_items.push(addmarker);
            }
            this.markerClusterData = map_items;
        },
        err => console.log(err), // error
        () => console.log('getItems Complete') // complete
      );
  }

  ngOnChanges(changes: any) { //changes: {[itemId: number]: SimpleChanges}){
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


