import { Component, Input, HostListener, OnDestroy} from '@angular/core';
import { Item } from '../item';

import { ItemService }  from '../item.service';
import { Subscription }   from 'rxjs/Subscription';


@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.css'],
  host: {'(keydown)': 'hotkeys($event)'}
})
export class ItemDetailComponent implements OnDestroy {

  @Input() item: Item;
  subscription: Subscription;

  itemStatusOptionsDropdown = ['loaded', 'verified', 'deleted'];
  otherSpeciesOptionsDropdown = ['squirrel', 'moose', 'other'];
  behaviourSelectedItems = [];
  behaviourOptionsDropdown = [];
  dropdownSettings = {};
  
  //for enter button press
  keyCode: number;
  event: string;

  constructor(private itemService: ItemService) {
     this.subscription = itemService.selectedItem$.subscribe(
      item => {
        this.item = item;
        
        var selection = ['climbing', 'Upsidedown', 'eating']; 
     
        var i = 1;
        selection.forEach(f => {
          var selection = {
            'id': i,
            'itemName': f
          }
          this.behaviourOptionsDropdown.push(selection);          
          i++;
        });
      this.dropdownSettings = { 
        singleSelection: false, 
        text:"Select",
        selectAllText:'Select All',
        unSelectAllText:'UnSelect All',
        enableSearchFilter: false,
        classes:"myclass custom-class"
      };  
/*
        this.itemService.getFilterOptions('itemstatus')
        .subscribe((options: any[]) => {
          options.forEach(f => {
            this.itemStatusOptionsDropdown.push(f.filter);
          });
        }) 
        this.itemService.getFilterOptions('speciesother')
        .subscribe((options: any[]) => {
          options.forEach(f => {
            this.otherSpeciesOptionsDropdown.push(f.filter);
          });
        }) 
        this.itemService.getFilterOptions('behaviour')
        .subscribe((options: any[]) => {
          options.forEach(f => {
            this.behaviourOptionsDropdown.push(f.filter);
          });
        }) 
        */
    });
  }  

  @HostListener('keydown', ['$event'])
  keyboardInput(event: KeyboardEvent) {
    console.log('keyboard event in item-detail');
    var keys = [39,37];
    //39 -> 
    //37 <-
    //up 38
    //down 40  
    //tab 9

    //console.log(event.keyCode);
    if ( keys.indexOf(event.keyCode) != -1)
    {
      console.log(event.keyCode);
      if (event.keyCode == 39) {
        this.goNext();
      }
      if (event.keyCode == 37) {
        this.goPrev();
      }
    }
    /*
    if (event == null) {
      this.event = 'undefined!';
    } else {
      this.event = 'defined';
    }
    
    event.preventDefault();
    event.stopPropagation();
    
    this.keyCode = event.keyCode;
    console.log(this.keyCode);
    */
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
  //items for behaviours
  onItemSelect(item:any){}
  OnItemDeSelect(item:any){}
  onSelectAll(items: any){}
  onDeSelectAll(items: any){}
}
