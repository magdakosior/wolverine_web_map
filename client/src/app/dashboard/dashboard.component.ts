import { Component, OnInit, ViewContainerRef, ViewEncapsulation} from '@angular/core';

import { Item } from '../item';
import { ItemService } from '../item.service';
import { MapComponent } from "../map/map.component";

import { ActivatedRoute } from '@angular/router';

//modal
//import { BrowserModule } from '@angular/platform-browser';
//import { ModalDirective,ModalModule } from 'ng2-bootstrap/ng2-bootstrap';
//import { Modal } from 'angular2-modal/plugins/bootstrap';
//import { overlayConfigFactory } from 'angular2-modal';
import {ItemFilterModal} from '../item-filter/item-filter.component';

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
  showFilterDialog = false;
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

  constructor(
    private itemService: ItemService,
    private route: ActivatedRoute,
    vcRef: ViewContainerRef//, 
    //public modal: Modal
    ) {
      //overlay..defaultViewContainer = vcRef
    }

  ngOnInit() {
    //if we get a value called from the item-search.componend
    const searchId = +this.route.snapshot.paramMap.get('id');//The JavaScript (+) operator converts the string to a number, which is what a hero id should be.
    
    if (searchId)
      this.searchItem(searchId);
  }

  mapEvent(map_info: JSON) {
    //map marker was clicked
    console.log('in dashboard  - noticed map.Emit event()');
    this.map_info = map_info;
    console.log(this.map_info);
    
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
    //console.log(this.map_info);
    
    this.itemService.getItem(itemId)
      .subscribe((item: Item) => {
        console.log('dashboard setting item ');
        console.log(item[0]);
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
            
            //console.log('in dashboard onPrev(), ' + String(item.id));
            //console.log(item);
            this.item = item; 
            
            this.getItems();
          }
        })
  }
  onNext(): void {
    this.itemService.getNextItem() 
      .subscribe((item: Item) => {
          if(item) {
            //console.log('in dashboard onNext(), ' + String(item.id));
            this.item = item; 
            this.setCurrentSelectedItem(this.item.id);
            
            //console.log(this.item);
            this.getItems();
          }
        })
  }

  setCurrentSelectedItem(id:number) {
    this.itemService.setSelectedItem(id);
    this.selectedItemId = id;
    //also set current selected in map

  }

  searchItem(searchId: number) {
    //console.log('in search item - got routed here');
    console.log('search for ' + String(searchId));
    this.setCurrentSelectedItem(searchId);
    this.getItem(searchId);
  }
}