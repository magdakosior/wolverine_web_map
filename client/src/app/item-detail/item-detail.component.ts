import { Component, OnInit, Input, OnChanges} from '@angular/core';
import { Item } from '../item';

//import { ActivatedRoute } from '@angular/router';
//import { Location } from '@angular/common';

import { ItemService }  from '../item.service';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.css']
})
export class ItemDetailComponent implements OnInit, OnChanges {

  @Input() item: Item;
  @Input('passItemId') itemId: number;

  constructor(
    //private route: ActivatedRoute,
    private itemService: ItemService//,
    //private location: Location
  ) {}

  ngOnInit(): void {
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
    this.item = this.item[0];
    console.log(this.item);
  }
  /*
  getHero(): void {
    //console.log('in hero-detail component: getHero()');
    //const id = +this.route.snapshot.paramMap.get('id');//The JavaScript (+) operator converts the string to a number, which is what a hero id should be.
    this.heroService.getHero(this.itemId)
      .subscribe(hero => this.hero = hero);
  }
*/
  goPrev(): void {
    //this.location.back();
  }
  goNext(): void {
    //this.location.back();
  }

  save(): void {
     this.itemService.updateItem(this.item)
       .subscribe(() => this.previous());
   }
}
