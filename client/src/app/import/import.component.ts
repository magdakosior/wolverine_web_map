import { Component, TemplateRef, OnInit, ChangeDetectorRef, ViewChild} from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { ItemService } from '../item.service';
//import { EXIF } from 'exif-js/exif';
//import * as EXIF from 'exif-js/exif';

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
  infoFile: any;
  uploadPaths = [];
  uploadCount = 0;

  constructor(
  	private modalService: BsModalService,
  	private itemService: ItemService, 
    private cdr: ChangeDetectorRef
    ) {
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

    var samplephoto = '/assets/photos/IMAG0629.JPG';
    var img = document.querySelector("#abc");  

    /*
        EXIF.getData(document.querySelector("image"), function() {
            console.log("in exif");
                
            )}

    //console.log(typeof(samplephoto));
    EXIF.getData(samplephoto, function(){
        console.log('here');
        console.log(EXIF.pretty(this));
        //alert(EXIF.pretty(this));
      });
      */
  }
  
  importNewFolder(event) {
    var sampleData = {
      folderPath: "/Users/Magda/Projects/angular-projects/hero3/client/src/assets/photos/session1",
      location: {
        latitude: 51.0810,
        longitude: -115.3451
      },
      sessionName: "session1",
      fileType: "JPG"
    };

    this.itemService.readInfoFile(sampleData)
      .subscribe((result: any) => {
          //will want to display this as alert!? if error or alert saying everything went through
          console.log(result);
          alert(result.result); 
          //this.items = items;
        })
    //this.uploadCount = files.length;
    //this.uploadPaths = [];
    //this.infoFile = files[0].webkitRelativePath;
    //var reader = new FileReader();
    //console.log(typeof(data));
    //console.log(data);
    //console.log(data.response);

    //var files = event.target.file;
    //console.log(file);
    
    //var file = files[0];

    //console.log(JSON.stringify(file));
    
    //console.log(files.webkitRelativePath);
      
    //this.uploadPaths.push(files.webkitRelativePath);

    /*
    Array.prototype.forEach.call(files, file => {
      console.log(typeof(file));

      this.uploadPaths.push(file.webkitRelativePath);
    });
    */
  }  

  updateMap() {

    //load appropriate markers(items to map)


    //this.itemService.importItems(this.uploadPaths);
    

    //this.uploadPaths.forEach(file => {
      //console.log(this.infoFile);
      //var data = this.itemService.readInfoFile(this.infoFile);
      //console.log(data);
      //var img1 = document.getElementById("image");
     // console.log(img1);

/*
      EXIF.getData(img1, function(){
        console.log('here');
        console.log(EXIF.pretty(this));
        //alert(EXIF.pretty(this));
      });*/
    //})


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