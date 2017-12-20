import { Component, TemplateRef, HostListener} from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { ItemService } from '../item.service';

@Component({
  selector: 'ngx',
  templateUrl: './ngx.html',
  styleUrls: ['./ngx.component.css'],
  host: {'(window:keydown)': 'hotkeys($event)'},
})
export class ngxModal {
	modalRef: BsModalRef;
  config = {
    animated: true,
    keyboard: true,
    backdrop: true,
    ignoreBackdropClick: false
  };

  modalOpen: boolean;
  filterOptions: any;
  //for enter button press
  keyCode: number;
  event: string;
  //for itemsStatus filter
  itemStatusOptions: String[];
  itemStatusChosen: String;

  constructor(
  	private modalService: BsModalService,
  	private itemService: ItemService //to get filer options from db

    ) {
    this.modalOpen = false;
  	console.log('filter modal constructor');
  }
 
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
  }

  openModal(template: TemplateRef<any>) {
  	console.log('modal opening');
    this.modalRef = this.modalService.show(template, this.config);
  }
 
  openModalWithClass(template: TemplateRef<any>) {
    console.log('modal openModalWithClass');
    this.modalOpen = true;
  	this.itemService.getFilterOptions('itemStatus')
      .subscribe((filters: String[]) => {
      	this.itemStatusOptions = filters;
      	this.itemStatusOptions.forEach(f => console.log(f));
        //console.log(filter);
        
      }) 
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, this.config, { class: 'gray modal-lg' })
    );
  }

  onSelect(productId) { 
    this.itemStatusChosen = null;
    for (var i = 0; i < this.itemStatusOptions.length; i++)
    {
      if (this.itemStatusOptions[i] == productId) {
        this.itemStatusChosen = this.itemStatusOptions[i];
      }
    }
  }

  applyFilter() {
  	console.log('modal getting filter ' + this.itemStatusChosen);
    this.itemService.setFilterOptions(this.filterOptions);
    this.modalRef.hide();
    this.modalOpen = true;
  }
  closeFilter() {
    this.modalRef.hide();
    this.modalOpen = false;

  }
}