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

  itemStatusOptionsDropdown = [];
  imgStatusOptionsDropdown = [];
  //itemStatusSelectedOption = '';
  
  constructor(private itemService: ItemService) {
    /*this.item = {
      id: 1,
      name: 'test',
      photoPath: 'assets/photos/IMG_1121.JPG',
      itemStatus: 'good',
      imgStatus: 'great',
      geom: null
    };*/

    this.subscription = itemService.selectedItem$.subscribe(
      item => {
        this.item = item;

        this.itemService.getFilterOptions('itemStatus')
        .subscribe((options: any[]) => {
          options.forEach(f => {
            this.itemStatusOptionsDropdown.push(f.filter);
          });
        }) 
        this.itemService.getFilterOptions('imgStatus')
        .subscribe((options: any[]) => {
          options.forEach(f => {
            this.imgStatusOptionsDropdown.push(f.filter);
          });
        }) 
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
        console.log(JSON.stringify(this.item));
      })
   }

   ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }
}
