import { Component, OnInit} from '@angular/core';

import { Item } from '../item';
import { ItemService } from '../item.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})

export class ItemsComponent implements OnInit {

  items: Item[]; //heroes service to expose these heroes for binding

  //used Angular Dependency Injection to inject it into a component
  constructor(private itemService: ItemService) { }
  
  //The component's ngOnInit lifecycle hook calls the HeroService method, not the constructor.
  ngOnInit() {
    this.getItems();    
  }

  //gave the HeroService get data method an asynchronous signature.
  getItems(): void {

    this.itemService.getItems() //returns an Observable<Hero[]> so that we can return an asynchronous list of heroes
        .subscribe((items: Item[]) => {

            // do stuff with our data here.
            console.log(items);
            // asign data to our class property in the end
            // so it will be available to our template
            this.items = items//.heroes
        })

          //heroes => this.heroes = heroes)
        console.log(this.items);
  }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.itemService.addItem({ name } as Item)
      .subscribe(item => {
        this.items.push(item);
      });
  }
  delete(item: Item): void {
    this.items = this.items.filter(h => h !== item);
    this.itemService.deleteItem(item).subscribe();
  }
}
