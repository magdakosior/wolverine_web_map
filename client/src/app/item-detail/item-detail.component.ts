import { Component, OnInit, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import { Item } from '../item';

//import { ActivatedRoute } from '@angular/router';
//import { Location } from '@angular/common';

import { ItemService }  from '../item.service';
//import { Subscription }   from 'rxjs/Subscription';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.css']
})
export class ItemDetailComponent implements OnInit, OnChanges {

  @Input() selectedItemId: number;
  @Input() item: Item;
  @Output() onNext = new EventEmitter<boolean>();
  @Output() onPrev = new EventEmitter<boolean>();

  constructor(private itemService: ItemService) {
  }

  ngOnInit(): void {
    //console.log('in hero-detail component: ngOnInit()');
  }

  ngOnChanges(changes: any) { 
    //console.log(this.item);
    //this.item = this.item[0];
  }

  getItem() {
    this.itemService.getItem(this.selectedItemId)
      .subscribe((item: Item) => {
        this.item = item 
        //console.log(JSON.stringify(this.item));
      })
  }

  goPrev(): void {
    this.onPrev.emit(true);
  }

  goNext(): void {
    this.onNext.emit(true);
  }

  save(): void {
     this.itemService.updateItem(this.item)
       .subscribe((item: Item) => {
        //this.item = item 
        //console.log(JSON.stringify(this.item));
      })
   }
}
