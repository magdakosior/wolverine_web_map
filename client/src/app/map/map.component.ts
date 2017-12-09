import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  
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

   // Generators for lat/lon values
  generateLat() { return Math.random() * 360 - 180; }
  generateLon() { return Math.random() * 180 - 90; }

  ngOnInit() {

    this.generateData();

  }

  markerClusterReady(group: L.MarkerClusterGroup) {

    this.markerClusterGroup = group;

  }
  onMapReady() {

  }

  generateData() {

    const data: any[] = [];

    for (let i = 0; i < 10000; i++) {

      const icon = L.icon({
        iconUrl: 'assets/images/marker-shadow.png', 
        shadowUrl: 'assets/images/marker-icon.png' 
      });

      data.push(L.marker([ this.generateLon(), this.generateLat() ], { icon }));
    }

    this.markerClusterData = data;

  }
}


