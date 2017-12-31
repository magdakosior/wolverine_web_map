import { Component, TemplateRef, OnInit, ChangeDetectorRef, ViewChild} from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { ItemService } from '../item.service';

@Component({
  selector: 'app-item-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css']}
)
export class importModal implements OnInit{
	modalRef: BsModalRef;
  config = {
    animated: true,
    keyboard: true,
    backdrop: true,
    ignoreBackdropClick: false
  };

  modalOpen: boolean;
  loadInfo: {
    path: '',
    lat: null,
    lon: null,
    session: null,
    filetype: null};
  
  constructor(
  	private modalService: BsModalService,
  	private itemService: ItemService, 
    private cdr: ChangeDetectorRef
    ) {
    this.loadInfo = {
    path: '',
    lat: null,
    lon: null,
    session: null,
    filetype: null}

    this.modalOpen = false;
  }

  ngOnInit() {
  }
 
  
  openModalWithClass(template: TemplateRef<any>) {
    this.modalOpen = true;
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, this.config, { class: 'gray modal-lg' })
    );
  }  

  updateMap() {
    console.log(this.loadInfo);
    /*
    var sampleData = {
      folderPath: "/Users/Magda/Projects/angular-projects/hero3/client/src/assets/photos/session1",
      location: {
        latitude: 51.0810,
        longitude: -115.3451
      },
      sessionName: "session1",
      fileType: "JPG"
    };*/

    
    this.itemService.readInfoFile(this.loadInfo)
      .subscribe((result: any) => {
          //will want to display this as alert!? if error or alert saying everything went through
          console.log(result);
          alert(result.result); 
          //this.items = items;
        })

    //close down modal and unset dropdown lists
    this.modalRef.hide();
    this.modalOpen = false;
  }

  closeImport() {
    this.modalRef.hide();
    this.modalOpen = false;
  }

  onItemSelect(item:any){}
  OnItemDeSelect(item:any){}
  onSelectAll(items: any){}
  onDeSelectAll(items: any){}
}