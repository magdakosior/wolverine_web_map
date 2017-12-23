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
  imgStatusOptions: {};
  

  //item status
  itemStatusDropdownList = [];
  itemStatusSelectedItems = [];
  dropdownSettings = {};
  
  //item status
  imgStatusDropdownList = [];
  imgStatusSelectedItems = [];
  //dropdownSettings = {};
  
   constructor(
  	private modalService: BsModalService,
  	private itemService: ItemService //to get filer options from db
    ) {
    this.modalOpen = false;
  	//console.log('filter modal constructor');
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

    //this.itemStatusSelectedItems = [];
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
          this.itemStatusDropdownList.push(selection);
          
          i++;
        });
        //console.log(this.itemStatusDropdownList);
      }) 

    this.itemService.getFilterOptions('imgStatus')
      .subscribe((filters: any[]) => {

        var i = 1;
        filters.forEach(f => {
          var selection = {
            'id': i,
            'itemName': f.filter
          }
          //console.log({"id":i,"itemName": f.filter});
          this.imgStatusDropdownList.push(selection);
          
          i++;
        });
        //console.log(this.itemStatusDropdownList);
      }) 
    
    //this makes modal show
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, this.config, { class: 'gray modal-lg' })
    );
  }

  applyFilter() {
    var filters = {};

    var filterwords = [];
    var concatstr1 = '';
    var concatstr2 = '';
    
    this.itemStatusSelectedItems.forEach(sel => filterwords.push("'" + sel.itemName+"'"));
    concatstr1 = filterwords.join(",");
    filterwords = [];
    this.imgStatusSelectedItems.forEach(sel => filterwords.push("'" + sel.itemName+"'"));
    concatstr2 = filterwords.join(",");
    //console.log(concatstr2);
    
    //put the two filter sources together
    filters = {
      "filters": [
        {"itemStatus": concatstr1},
        {"imgStatus": concatstr2}
      ]
    }
    console.log(JSON.stringify(filters));

    //send to item service to send to server
    this.itemService.setServicefilterOptions(filters);
    //close down modal and unset dropdown lists
    this.modalRef.hide();
    this.modalOpen = false;
    this.itemStatusDropdownList = [];
    this.imgStatusDropdownList = [];
  }

  closeFilter() {
    this.modalRef.hide();
    this.modalOpen = false;
    this.itemStatusDropdownList = [];

    this.imgStatusDropdownList = [];
  }

  onItemSelect(item:any){}
  OnItemDeSelect(item:any){}
  onSelectAll(items: any){}
  onDeSelectAll(items: any){}
}