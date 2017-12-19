import { Component, OnInit, Input, OnChanges} from '@angular/core';
import { Item } from '../item';

import { ItemService }  from '../item.service';

@Component({
  selector: 'app-item-photo',
  templateUrl: './item-photo.component.html',
  styleUrls: ['./item-photo.component.css']
})
export class ItemPhotoComponent implements OnInit, OnChanges {

  @Input() item: Item;
  
  constructor(
    private heroService: ItemService

    //private location: Location  
  ) {}

  ngOnInit(): void {
  }

  ngOnChanges(changes: any) { //changes: {[itemId: number]: SimpleChanges}){
    console.log('in item-photo component: ngOnChanges()');
    if(this.item) {
      this.item = this.item;//[0];
      console.log(this.item);
    }
  }
  
  getPhoto(): void {
  }
}
