import { Component, OnInit } from '@angular/core';

import { Item } from '../item';
import { ItemService } from '../item.service';
import { MapComponent } from "../map/map.component";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {
  
  selectedItemId: number;
  item: Item;
  items: Item[];
  map_info: any = {};
  /*map_info = {
    zoom: 16,
    extents: {
      east:-115.13946533203126,
      west:-115.55042266845705,
      north:51.12421275782688,
      south:51.037939894299356
    },
    selectedId: null,
    prevId: null,
    nextID: null
  };*/

  constructor(private itemService: ItemService) { }

  ngOnInit() {
  }

  mapEvent(map_info: JSON) {
    //map marker was clicked
    //console.log('in dashboard  - noticed map.Emit event()');
    this.map_info = map_info;

    //set selected id in item service
    if (this.map_info.selectedId) {
      //set selected item for details component
      this.selectedItemId = this.map_info.selectedId;
      this.getItem(this.map_info.selectedId);
    }
    this.getItems();
  }

  getItem(itemId: number) {
    //console.log('calling next from dash getItem ' + String(itemId));
    console.log(this.map_info);
    
    this.itemService.getItem(itemId)
      .subscribe((item: Item) => {
        //console.log('dashboard setting item ');
        //console.log(item);
        this.item = item[0];
      })
  }

  getItems(): void {
    var coords = '?east=' + String(this.map_info.extents.east) + '&west=' + String(this.map_info.extents.west) + '&north=' + String(this.map_info.extents.north) + '&south=' + String(this.map_info.extents.south);
    this.itemService.getItemsWithinBounds(coords) 
      .subscribe((items: Item[]) => {
        //console.log('in dashboard getItems(), setting items[] ');
          this.items = items; 
        })
  }

  onPrev(): void {
    this.itemService.getPrevItem() 
      .subscribe((item: Item) => {
          if(item) {
            this.setCurrentSelectedItem(item.id);
            
            console.log('in dashboard onPrev(), ' + String(item.id));
            console.log(item);
            this.item = item; 
            
            this.getItems();
          }
        })
  }
  onNext(): void {
    this.itemService.getNextItem() 
      .subscribe((item: Item) => {
          if(item) {
            console.log('in dashboard onNext(), ' + String(item.id));
            this.item = item; 
            this.setCurrentSelectedItem(this.item.id);
            
            console.log(this.item);
            this.getItems();
          }
        })
  }

  setCurrentSelectedItem(id:number) {
    this.itemService.setSelectedItem(id);
    this.selectedItemId = id;
    //also set current selected in map

  }

  findElement(arr, propName, propValue) {
    for (var i=0; i < arr.length; i++)
      if (arr[i][propName] == propValue)
        return arr[i];
    // will return null if not found; 
    return null;
  }

}