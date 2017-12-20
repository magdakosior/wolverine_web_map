import { Component, Input, OnDestroy} from '@angular/core';
import { Item } from '../item';

import { ItemService }  from '../item.service';
import { Subscription }   from 'rxjs/Subscription';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.css']
})
export class ItemDetailComponent implements OnDestroy {

  @Input() item: Item;
  subscription: Subscription;

  constructor(private itemService: ItemService) {
    this.subscription = itemService.selectedItem$.subscribe(
      item => {
        this.item = item;
    });
  }

  goPrev(): void {
    this.itemService.setPrev();
  }

  goNext(): void {
    this.itemService.setNext();
  }

  save(): void {
     this.itemService.updateItem(this.item)
       .subscribe((item: Item) => {
        //this.item = item 
        //console.log(JSON.stringify(this.item));
      })
   }

   ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }
}
