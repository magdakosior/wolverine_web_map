import { Component, OnInit, Input, OnChanges} from '@angular/core';
import { Item } from '../item';

//import { ActivatedRoute } from '@angular/router';
//import { Location } from '@angular/common';

import { ItemService }  from '../item.service';

@Component({
  selector: 'app-item-photo',
  templateUrl: './item-photo.component.html',
  styleUrls: ['./item-photo.component.css']
})
export class ItemPhotoComponent implements OnInit, OnChanges {

  @Input() item: Item;
  @Input('passItemId') itemId: number;

  constructor(
    //private route: ActivatedRoute,
    private heroService: ItemService

    //private location: Location  
  ) {}

  ngOnInit(): void {
    //console.log(this.item.photoPath);
    //console.log('in hero-detail component: ngOnInit()');
    //this.getHero();
    //console.log(JSON.stringify(this.hero));
    //this.hero = this.hero[0];
  }

  ngOnChanges(changes: any) { //changes: {[itemId: number]: SimpleChanges}){
    //console.log('in hero-detail component: ngOnChanges()');
    //console.log(changes.prop);
    //make request and get the matching data and bind to 
    //this.searchedResults =  //data coming from the service resul()
    //this.getHero();
    if(this.item) {
      this.item = this.item[0];
      //console.log(this.item);
    }
  }
  
  getPhoto(): void {
    //this.location.back();
  }
}
