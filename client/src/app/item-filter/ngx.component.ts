import { Component, TemplateRef, HostListener, OnInit} from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { Filter } from '../filter';

import { ItemService } from '../item.service';

@Component({
  selector: 'ngx',
  templateUrl: './ngx.html',
  styleUrls: ['./ngx.component.css'],
  host: {'(window:keydown)': 'hotkeys($event)'},
})
export class ngxModal implements OnInit{
	modalRef: BsModalRef;
  config = {
    animated: true,
    keyboard: true,
    backdrop: true,
    ignoreBackdropClick: false
  };

  modalOpen: boolean;
  //for enter button press
  keyCode: number;
  event: string;
  //for itemsStatus filter
  itemStatusOptions: {};
  

  //item status
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  
  constructor(
  	private modalService: BsModalService,
  	private itemService: ItemService //to get filer options from db
    ) {
    this.modalOpen = false;
  	console.log('filter modal constructor');
  }

  //https://www.npmjs.com/package/angular2-multiselect-dropdown
  ngOnInit() {
  }

  
 /*
  @HostListener('window:keydown', ['$event'])
  keyboardInput(event: KeyboardEvent) {
    if (this.modalOpen) {
      if (event == null) {
        this.event = 'undefined!';
      } else {
        this.event = 'defined';
      }
      
      event.preventDefault();
      event.stopPropagation();
      
      this.keyCode = event.keyCode;
      this.applyFilter();
    }
  }*/

  openModalWithClass(template: TemplateRef<any>) {
    this.modalOpen = true;

    //this.selectedItems = [];
    this.dropdownSettings = { 
      singleSelection: false, 
      text:"Status Filter(s)",
      selectAllText:'Select All',
      unSelectAllText:'UnSelect All',
      enableSearchFilter: false,
      classes:"myclass custom-class"
    };   

  	this.itemService.getFilterOptions('itemStatus')
      .subscribe((filters: any[]) => {

        var i = 1;
        filters.forEach(f => {
          var selection = {
            'id': i,
            'itemName': f.filter
          }
          //console.log({"id":i,"itemName": f.filter});
          this.dropdownList.push(selection);
          
          i++;
        });
        //console.log(this.dropdownList);
      }) 
    
    //this makes modal show
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, this.config, { class: 'gray modal-lg' })
    );
  }

  applyFilter() {
  	console.log('modal getting filter ');
    console.log(JSON.stringify(this.selectedItems));
    /* result looks like
    [
    {"id":1,"itemName":"deleted"},
    {"id":2,"itemName":"loaded"}
    ]
    */
    var itemStatusFilters = [];
    this.selectedItems.forEach(sel =>{
      itemStatusFilters.push(sel);
    })
    this.itemStatusOptions = {
      itemStatus: itemStatusFilters
    }
    console.log(this.itemStatusOptions);
    /* result looks like
    itemStatus: [
    0: {"id":1,"itemName":"deleted"},
    1: {"id":2,"itemName":"loaded"}
    ]
    */
    //let itemStatusResult: JSON = this.itemStatusChosen;//this.filterOptions.itemStatus.or = this.itemStatusChosen;
    this.itemService.setServicefilterOptions(this.itemStatusOptions);
    this.modalRef.hide();
    this.modalOpen = false;
    this.dropdownList = [];
  }

  closeFilter() {
    this.modalRef.hide();
    this.modalOpen = false;
    this.dropdownList = [];
  }

  onItemSelect(item:any){
      //console.log(item);
      //console.log(this.selectedItems);
  }
  OnItemDeSelect(item:any){
      //console.log(item);
      //console.log(this.selectedItems);
  }
  onSelectAll(items: any){
      //console.log(items);
  }
  onDeSelectAll(items: any){
      //console.log(items);
  }
}