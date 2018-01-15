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
  behaviourOptionsDropdown = [];
  behaviourSelectedItems = [];
  dropdownSettings = {};
  
  startDate: any=new Date();

  //for enter button press
  keyCode: number;
  event: string;
  
  savedData = {checked: false}

  /*savedData = new any({
    checked: boolean;
    status: string;
    cameracheck: boolean;
    indivname: string;
    wolvspecies: boolean;
    otherspecies: string;
    numanimalsvis: number;
    age: number;
    sex: string;
    behaviour: string;
    chestvis: boolean;
    sexvis: boolean;
    lactvis: boolean;
    baitvis: boolean;
    baitrem: boolean;
    baitremdate: Date;
  }
*/
  datapreset:any = {
    visible: false,
    checked: false,
    };

  constructor(private itemService: ItemService) {
    console.log('in constructor');
    this.subscription = itemService.selectedItem$.subscribe(
      item => {
        this.item = item;
        if(this.item.daterembait) {
          this.item.daterembait = this.item.daterembait.slice(0, 10);
        }
        var selection = ['climbing', 'Upsidedown', 'eating']; 
     
        var i = 1;
        this.behaviourOptionsDropdown = [];
        this.behaviourSelectedItems = [];
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
        classes:"myclass customDropDownMulti"
      }; 
      
      //if this item has behaviours then show them
      if (this.item.behaviour) {
        var j = 1;
        this.item.behaviour.split(',').forEach(f => {
          //console.log(f);//.replace(/'/g,"")
          this.behaviourSelectedItems.push({
            'id': j,
            'itemName': f
          });
          j++;
        });
      }

      /*checked: boolean;
    status: string;
    cameracheck: boolean;
    indivname: string;
    wolvspecies: boolean;
    otherspecies: string;
    numanimalsvis: number;
    age: number;
    sex: string;
    behaviour: string;
    chestvis: boolean;
    sexvis: boolean;
    lactvis: boolean;
    baitvis: boolean;
    baitrem: boolean;
    baitremdate: Date;


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

  goPrev(): void {
    this.itemService.setPrev();
  }

  goNext(): void {
    this.save();
    this.itemService.setNext();
  }

  //set this only after an import?!
  saveNext(): void {
    console.log('saving data');

  }

  save(): void {
    var behaviours = [];
    var resultStr = '';
    this.behaviourSelectedItems.forEach(sel => behaviours.push("'" + sel.itemName+"'"));
    resultStr = behaviours.join(",");
    this.item.behaviour = resultStr.replace(/'/g,"");
    
    this.itemService.updateItem(this.item)
      .subscribe((item: Item) => {
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


  onStartDateChange(date) {
    this.startDate = date;
    this.startDate = new Date(this.startDate).toISOString();
  }

  convertDate(d) {
    var date = new Date(d)
    var yyyy = date.getFullYear().toString();
    var mm = (date.getMonth()+1).toString();
    var dd  = date.getDate().toString();

    var mmChars = mm.split('');
    var ddChars = dd.split('');

    return yyyy + '-' + (mmChars[1]?mm:"0"+mmChars[0]) + '-' + (ddChars[1]?dd:"0"+ddChars[0]);
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
}
