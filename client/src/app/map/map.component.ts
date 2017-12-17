import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';

import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

import { ItemService } from '../item.service';
import { Item } from '../item';

//@Component is a decorator function that specifies the Angular metadata for the component.
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnChanges {
  customMarker = L.Marker.extend({
    options: { 
      id: 0
   }
  });
  
  //used Angular Dependency Injection to inject it into a component
  constructor(private itemService: ItemService) { }
  
  @Output() mapEvent = new EventEmitter();
  @Input() items: Item[];  //items: Item[];
  @Input() item: Item; 

  selectedMarker = new this.customMarker();
  
  //not sure how to initialize this!!
  map_info = {
    zoom: 16,
    extents: {
      east:-115.13946533203126,
      west:-115.55042266845705,
      north:51.12421275782688,
      south:51.037939894299356
    },
    selectedId: null,
    prevId: null,
    nextId: null
  };

  redIcon = L.icon({
      iconUrl: 'assets/images/red-map-marker.png',
      shadowUrl: 'assets/images/marker-shadow.png'
    });
  blueIcon = L.icon({
    iconUrl: 'assets/images/marker-icon.png',
    shadowUrl: 'assets/images/marker-shadow.png'
  });

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
  map: L.Map;

  ngOnInit() {
    //console.log('in map oninit, sending initial map data');
    this.mapEvent.emit(this.map_info);
    if (this.items)
      this.setMarkers(); 
  }

  ngOnChanges(changes: SimpleChanges) { 
    if (this.item) {
      if (this.item.id != this.selectedMarker.options.id) {
        console.log('change in item ');
        var newLat = this.item.geom.coordinates[0][1];
        var newLon = this.item.geom.coordinates[0][0]
        var marker = this.createCustomMarker(newLat, newLon, this.blueIcon, this.item.id);
        this.selectedMarker = marker;
        //console.log(this.selectedMarker);
        this.map_info.selectedId = this.item.id;
        //center on newly set marker
        this.map.panTo(new L.LatLng(newLat, newLon));
      }
    }
    if (this.items) {
      console.log('change in item(s) ');
      this.setMarkers();
    }
  }

  getMapCoords(map: L.Map) {
    this.map_info.zoom = map.getZoom();
    this.map_info.extents.east = map.getBounds().getEast();
    this.map_info.extents.west = map.getBounds().getWest();
    this.map_info.extents.north = map.getBounds().getNorth();
    this.map_info.extents.south = map.getBounds().getSouth();

    this.mapEvent.emit(this.map_info);
    //set map coords for dashboard to see
    this.setMarkers(); 
  }

  markerClusterReady(group: L.MarkerClusterGroup) {
    this.markerClusterGroup = group;
  } 

  onMapReady(map: L.Map) {
    this.map = map;

    map.on('load', () => {
      this.getMapCoords(map);
    })

    map.on('moveend', () => {
      this.getMapCoords(map);
    });
  }

  createCustomMarker(lat: number, lon: number, icon: L.Icon, id: number) {
    var addmarker = new this.customMarker([ lat, lon ], { icon: icon, id: id})
      .on({
            'click': event => {
              //set the selected, next and prev marker info to pass back to dashboard
              this.map_info.selectedId = id;
              this.mapEvent.emit(this.map_info);

              if(this.selectedMarker.options.id != 0) {  //if marker is set
                if(this.selectedMarker != event.target) {
                    this.selectedMarker.setIcon(this.blueIcon);
                    this.selectedMarker = event.target;
                    this.selectedMarker.setIcon(this.redIcon);
                }
              }
              else { //marker has not been set
                this.selectedMarker = event.target;
                this.selectedMarker.setIcon(this.redIcon); //set highlight icon
              }
            }
        });
    return addmarker;
  }

  //gave the HeroService get data method an asynchronous signature.
  setMarkers(): void {  
    console.log(this.items); 
    if (this.items) {
      var map_markers: any[] = [];
      for (let i = 0; i < Object.keys(this.items).length; i++) {
      
        var lat = this.items[i].geom.coordinates[0][1];
        var lon = this.items[i].geom.coordinates[0][0];
        var id = this.items[i].id;
      
        var addmarker = this.createCustomMarker(lat, lon, this.blueIcon, id);
          
        if (this.selectedMarker) {
          //console.log(this.selectedMarker);
          if (this.selectedMarker.options.id == addmarker.options.id) {
            addmarker.setIcon(this.redIcon);
            this.selectedMarker = addmarker;
            var coords = L.latLng([ 51.0810, -115.3451 ])
            //this.map.setView(coords, this.options.zoom);
          }
        }
        map_markers.push(addmarker);
      }
      this.markerClusterData = map_markers;
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
        setMarkers(r.aggregations.zoom.buckets);
      },
      error: function(error) {
        console.log(error)
      }
    });*/
  
  
}


