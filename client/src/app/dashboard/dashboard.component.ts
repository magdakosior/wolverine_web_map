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
  item: Item;
  currentItem: Item;
  currentItemId: number;
  
  constructor(private itemService: ItemService) { }

  ngOnInit() {
    //this.getHeroes();
  }

  markerClick(currentItemId: number) {
    //console.log('Current marker click ');
    //console.log(currentItemId);
    this.currentItemId = currentItemId;
    this.getItem();
    //console.log('in dashboard hero subscription -just set hero id in markerClick()');
  }

  getItem() {
    //console.log('dashboard getItem()');
    ///console.log(currentMarker);
    this.itemService.getItem(this.currentItemId)
      .subscribe((item: Item) => {
            // do stuff with our data here.
            //console.log(heroes);
            // asign data to our class property in the end
            // so it will be available to our template
        this.item = item //= heroes.slice(1, 5)
        //console.log('in dashboard hero subscription -just set hero');
        //console.log(JSON.stringify(this.hero));
      })
  }
  /*
  getHeroes(): void {
    console.log('in dashboard get heros() ');
    this.heroService.getHeroes()
      .subscribe((heroes: Hero[]) => {
        console.log('in dashboard heros subscription ');
            // do stuff with our data here.
            //console.log(heroes);
            // asign data to our class property in the end
            // so it will be available to our template
            this.heroes = heroes //= heroes.slice(1, 5)
        })

    //this.heroService.getHeroes()
      //.subscribe(heroes => this.heroes = heroes.slice(1, 5));
  }
  */
}