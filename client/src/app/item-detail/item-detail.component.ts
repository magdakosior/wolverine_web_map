import { Component, Input, HostListener, OnDestroy} from '@angular/core';
import { Item } from '../item';
import { Import } from '../import';

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

  importType: boolean = false;
  markerNotSet = false;
  
  import = new Import(); //this is to set some import details to retrieve lastverified num

  savedData: any = {}
  startDate: any=new Date();

  //for enter button press
  keyCode: number;
  event: string;
  
  constructor(private itemService: ItemService) {
    //console.log(this.savedData);
    this.subscription = itemService.selectedItem$.subscribe(
      item => {
        this.item = item; //set item to selected item
        //format daterembait date field to not have time (breaks input)
        if ((this.item) && (this.item.daterembait != null)) {
          this.item.daterembait = this.item.daterembait.slice(0, 10);
        }

        //listen for  type = import set by selected item from service
        if (this.itemService.getImportType()) {
          this.importType = true;
          //determine if any markers have been set for this batch (chech with item.service)
          this.itemService.getMarkerSet(this.item.importid)
            .subscribe((result: any) => {
              if (result[0].count > 0) {
                this.markerNotSet = false;
              }
              else
                this.markerNotSet = true;
            })

          //if save settings option was checked off then load settings from previous itemv (overwrite if necessary).
          //load saved values to check if preset was checked to be true
          var loadItem = new Item();
          loadItem = this.itemService.retrievePresetData();
          if (loadItem.datapreset) {  
            this.item.itemstatus = loadItem.itemstatus;
            this.item.checkcamera = loadItem.checkcamera;
            this.item.marker = loadItem.marker;
            this.item.indivname = loadItem.indivname;
            this.item.specieswolv = loadItem.specieswolv;
            this.item.speciesother = loadItem.speciesother;
            this.item.numanimals = loadItem.numanimals;
            this.item.age = loadItem.age;
            this.item.sex = loadItem.sex;
            this.item.behaviour = loadItem.behaviour;
            this.item.vischest = loadItem.vischest;
            this.item.vissex = loadItem.vissex;
            this.item.vislactation = loadItem.vislactation;
            this.item.visbait = loadItem.visbait;
            this.item.removedbait = loadItem.removedbait;
            this.item.daterembait = loadItem.daterembait;
            this.item.datapreset = loadItem.datapreset; //keep it to save 
          }
        }//end importType

        //load default behaviour dropdown options
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
        //if this item has behaviours then show them
        if ((this.item != null) && (this.item.behaviour != null)) {
          var j = 1;
          this.item.behaviour.split(',').forEach(f => {
            //console.log(f);//.replace(/'/g,"")
            this.behaviourSelectedItems.push({
              'id': j,
              'itemName': f
            });
            j++;
          });
        }//end item behaviour

        //set general dropdown settings
        this.dropdownSettings = { 
          singleSelection: false, 
          text:"Select",
          selectAllText:'Select All',
          unSelectAllText:'UnSelect All',
          enableSearchFilter: false,
          classes:"myclass customDropDownMulti"
        }; 
    });// end item
  }//end constructor

  goPrev(): void {
    this.savedData = {};
    this.itemService.savePresetData(this.savedData);
    
    if (this.importType)
      this.itemService.setPrev(true);//setting this ensures that the preset values checkbox is visible again
    else
      this.itemService.setPrev();
  }

  goNext(): void {
    this.save();

    //save data to item.service for the next item (pre-sets)
    if (this.item.datapreset) {
      console.log('saving data');
      this.savedData.itemstatus = this.item.itemstatus;
      this.savedData.checkcamera = this.item.checkcamera;
      this.savedData.marker = this.item.marker;
      this.savedData.indivname = this.item.indivname;
      this.savedData.specieswolv = this.item.specieswolv;
      this.savedData.speciesother = this.item.speciesother;
      this.savedData.numanimals = this.item.numanimals;
      this.savedData.age = this.item.age;
      this.savedData.sex = this.item.sex;
      this.savedData.behaviour = this.item.behaviour;
      this.savedData.vischest = this.item.vischest;
      this.savedData.vissex = this.item.vissex;
      this.savedData.vislactation = this.item.vislactation;
      this.savedData.visbait = this.item.visbait;
      this.savedData.removedbait = this.item.removedbait;
      this.savedData.daterembait = this.item.daterembait;
      this.savedData.datapreset = this.item.datapreset;
      this.itemService.savePresetData(this.savedData);
    }
    else {
      this.savedData = {};
      this.itemService.savePresetData(this.savedData);
    }

    if (this.importType)
      this.itemService.setNext(true); //setting this ensures that the preset values checkbox is visible again
    else
      this.itemService.setNext();
  }

  save(): void {
    var behaviours = [];
    var resultStr = '';
    
    //set behaviour string from options chosen in dropdown
    if (this.behaviourSelectedItems.length > 0) {
      this.behaviourSelectedItems.forEach(sel => behaviours.push("'" + sel.itemName+"'"));
      resultStr = behaviours.join(",");
      this.item.behaviour = resultStr.replace(/'/g,"");
  }
    //save item data to db
    this.itemService.updateItem(this.item)
      .subscribe((item: Item) => {
      })

    //update last verified if it was an import so that we know where we are in verifying import photos
    this.import.importid = this.item.importid;
    this.import.lastverified = this.item.id;
    
    this.itemService.updateImportsLastVerified(this.import)
      .subscribe((item: Import) => {
        //console.log('updated import');
      })
   }//end save()

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
    //console.log('keyboard event in item-detail');
    var keys = [39,37];
    //39 -> 
    //37 <-
    //up 38
    //down 40  
    //tab 9

    //console.log(event.keyCode);
    if ( keys.indexOf(event.keyCode) != -1)
    {
      //console.log(event.keyCode);
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
