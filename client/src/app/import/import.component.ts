import { Component, TemplateRef, OnInit, ChangeDetectorRef} from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { ItemService } from '../item.service';

@Component({
  selector: 'app-item-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css']},
})
export class importModal implements OnInit{
	modalRef: BsModalRef;
  config = {
    animated: true,
    keyboard: true,
    backdrop: true,
    ignoreBackdropClick: false
  };

  modalOpen: boolean;
  folderURL: string;
  uploadPaths = [];
  
  constructor(
  	private modalService: BsModalService,
  	private itemService: ItemService, //to get filer options from db
    private cdr: ChangeDetectorRef
    ) {
    this.modalOpen = false;
  }

  ngOnInit() {
  }

  folderPicked(files) {
    console.log(files);
    this.uploadPaths = [];
    Array.prototype.forEach.call(files, file => {
      this.uploadPaths.push(file.webkitRelativePath);
    });
  }

  openModalWithClass(template: TemplateRef<any>) {
    this.modalOpen = true;
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, this.config, { class: 'gray modal-lg' })
    );
  }
  
  importImages() {
    this.itemService.importItems(this.uploadPaths);

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