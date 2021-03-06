import { Component, Input, OnDestroy } from '@angular/core';
import { Item } from '../item';

import { ItemService }  from '../item.service';
import { Subscription }   from 'rxjs/Subscription';

@Component({
  selector: 'app-item-photo',
  templateUrl: './item-photo.component.html',
  styleUrls: ['./item-photo.component.css']
})
export class ItemPhotoComponent implements OnDestroy  {

  @Input() item: Item;
  subscription: Subscription;

  constructor(private itemService: ItemService) {
    this.subscription = itemService.selectedItem$.subscribe(
      item => {
        this.item = item;
        this.item.photopath = 'http://127.0.0.1:8887/' + this.item.photopath;
        console.log(this.item.photopath);
    });
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }
}
