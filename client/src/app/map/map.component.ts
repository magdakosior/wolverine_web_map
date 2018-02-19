//import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Component } from '@angular/core';
import * as L from 'leaflet';

import { ItemService } from '../item.service';
import { Item } from '../item';
import { MapDetails } from '../mapDetails';

import { filterModal } from '../item-filter/filter.component';
import { importModal } from '../import/import.component';

import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

import {MatSidenavModule} from '@angular/material/sidenav';

//@Component is a decorator function that specifies the Angular metadata for the component.
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  providers: [ItemService]
})
export class MapComponent { //implements OnInit, OnChanges {
  
  //leaflet  Marker cluster stuff
  markerClusterGroup: L.MarkerClusterGroup;
  markerClusterData: any[] = [];
  markerClusterOptions: L.MarkerClusterGroupOptions;
  map: L.Map;
  mapData = new MapDetails();
  
  customMarker = L.Marker.extend({
    options: { 
      id: 0
   }
  });
  selectedMarker = new this.customMarker();

  //used Angular Dependency Injection to inject it into a component
  constructor(private itemService: ItemService) { 
    //listen for selected item change from service
    itemService.selectedItem$.subscribe(
      selectedItem => {
        
        if (selectedItem) {
          if (selectedItem.id != this.selectedMarker.options.id) {
          var newLat = selectedItem.geom.coordinates[0][1];
          var newLon = selectedItem.geom.coordinates[0][0]
          var marker = this.createCustomMarker(newLat, newLon, this.blueIcon, selectedItem.id);
          this.selectedMarker = marker;
          //center on newly set marker
          this.map.panTo(new L.LatLng(newLat, newLon));
          }
        }
        else {
          console.log('setting selected marker to null!!')
          this.selectedMarker = null;
        }
      });

    //listen for  items change from service
    itemService.allItems$.subscribe(
      items => {
        //set markers onto map
        this.setMarkers(items);
      });
  }
  
  announceMapDetails(map: L.Map) {
    if (map) {
      this.mapData.zoom = 16;//map.getZoom();
      this.mapData.ext_east = map.getBounds().getEast();
      this.mapData.ext_west = map.getBounds().getWest();
      this.mapData.ext_north = map.getBounds().getNorth();
      this.mapData.ext_south = map.getBounds().getSouth();
    }
    this.itemService.setMapDetails(this.mapData);
  }
  
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

  onMapReady(map: L.Map) {
    this.map = map;
    this.announceMapDetails(map);

    map.on('moveend', () => {
      this.announceMapDetails(map);  //to service, service will get items and listener in constructor wil listen to set map markers
    });
  }
  markerClusterReady(group: L.MarkerClusterGroup) {
    this.markerClusterGroup = group;
  } 

  createCustomMarker(lat: number, lon: number, icon: L.Icon, id: number) {
    var addmarker = new this.customMarker([ lat, lon ], { icon: icon, id: id})
      .on({
            'click': event => {
              //set the selected, next and prev marker info to pass back to dashboard
              this.itemService.setSelectedItem(id);
              
              if((this.selectedMarker) && (this.selectedMarker.options.id != 0)) {  //if marker is set
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

  setMarkers(items:Item[]): void {  
    //check to see if we are showing map and items on import, if so then we display all, otherwise just the ones that were set with marker
    var importType = false;
    if (this.itemService.getImportType()) {
      importType = true;
      console.log('we are in import type');
    }
    if (items) {
      var map_markers: any[] = [];
      for (let i = 0; i < Object.keys(items).length; i++) {
        console.log(items[i]);
        if ((items[i].marker) || (importType)) {
          var lat = items[i].geom.coordinates[0][1];
          var lon = items[i].geom.coordinates[0][0];
          var id = items[i].id;
        
          var addmarker = this.createCustomMarker(lat, lon, this.blueIcon, id);
          
          if (this.selectedMarker) {
            if (this.selectedMarker.options.id == addmarker.options.id) {
              addmarker.setIcon(this.redIcon);
              this.selectedMarker = addmarker;
              var coords = L.latLng([ 51.0810, -115.3451 ])
            }
          }//end if loop
          map_markers.push(addmarker);
        }
      }//end for loop
      this.markerClusterData = map_markers;
    }
  }

  getMapBounds(): void {
  }
}


