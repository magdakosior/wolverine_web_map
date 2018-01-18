import { Component, TemplateRef, OnInit, ChangeDetectorRef, ViewChild} from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ItemService } from '../item.service';
import { Import } from '../import';

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

  import = new Import(); //this is to set some import details to retrieve lastverified num

  importForm: FormGroup;
  path: FormControl;
  lat: FormControl;
  lon: FormControl;
  session: FormControl;
  filetype: FormControl;
  previmport: FormControl;

  loadInfo: {
    path: '',
    lat: null,
    lon: null,
    session: null,
    filetype: null};
  
  prevImportDropdown = [];
  previousimport: string;

  constructor(
  	private modalService: BsModalService,
  	private itemService: ItemService, 
    private cdr: ChangeDetectorRef
    ) {
    
    this.modalOpen = false;
  }

  ngOnInit() {

    this.loadInfo = {
      path: '',
      lat: null,
      lon: null,
      session: null,
      filetype: null}

    this.path = new FormControl(this.loadInfo.path, [
        Validators.required
      ]);
    this.lat = new FormControl(this.loadInfo.lat, [
        Validators.min(45.95),
        Validators.max(83.11)
        ]);
    this.lon = new FormControl(this.loadInfo.lon, [
        Validators.min(-141.00),
        Validators.max(-52.61)
        ]);
    this.session = new FormControl(this.loadInfo.session, Validators.required);
    this.filetype = new FormControl(this.loadInfo.filetype);
    this.previmport = new FormControl(this.previousimport);

    this.importForm = new FormGroup({
      path: this.path,
      lat: this.lat,
      lon: this.lon,
      session: this.session,
      filetype: this.filetype,
      previmport: this.previmport
    });
    
    //load previous imports into dropdown
    this.itemService.getImports()
      .subscribe((options: any[]) => {
        //console.log(options);
        options.forEach(f => {
          this.prevImportDropdown.push(f.importid);
        });
      }) 

    //change import type, unset validators to new import type
    this.importForm.get('previmport').valueChanges.subscribe(

    (previmport: string) => {
        this.importForm.get('path').setValidators(null);
        this.importForm.get('lat').setValidators(null);
        this.importForm.get('lon').setValidators(null);
        this.importForm.get('session').setValidators(null);

        this.importForm.get('path').updateValueAndValidity();
        this.importForm.get('lat').updateValueAndValidity();
        this.importForm.get('lon').updateValueAndValidity();
        this.importForm.get('session').updateValueAndValidity();
    })
  }
  
  openModalWithClass(template: TemplateRef<any>) {
    this.modalOpen = true;
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, this.config, { class: 'gray modal-lg' })
    );
  }  

  importPhotos() {
    /*
    var sampleData = {
      folderPath: "/Users/Magda/Projects/angular-projects/hero3/client/src/assets/photos/session1",
      location: {
        latitude: 51.0810,
        longitude: -115.3451
      },
      sessionName: "session1",
      fileType: "JPG"
    };
    */
  //an import was chosen from the dropdown - we are loading a previous import
  if (this.importForm.get('previmport').value) {
    //set the filter string and current import id for map retrieving items
    this.itemService.setImportDetails(this.importForm.get('previmport').value);
    //get the current id that person is on (last verified id)
    this.itemService.getImportsId(this.importForm.get('previmport').value)
      .subscribe((result: any) => {
          this.itemService.setSelectedItem(result[0].lastverified, true);
        })
    this.importForm.setValue({path: '', lat:'', lon:'', session:'', previmport:'', filetype:''});
  }
  else if (this.importForm.get('path').value) {////load new import from file
    //load values from form into loadInfo object
    this.loadInfo = {
      path: this.importForm.get('path').value,
      lat: this.importForm.get('lat').value,
      lon: this.importForm.get('lon').value,
      session: this.importForm.get('session').value,
      filetype: this.importForm.get('filetype').value}

    //pass values to itemService to load into db
    this.itemService.importFromFile(this.loadInfo)
      .subscribe((result: any) => {
          //will want to display this as alert!? if error or alert saying everything went through
          alert(result.result); 
          //now that we have a result we can call a function to set the first marker
          this.importForm.setValue({path: '', lat:'', lon:'', session:'', previmport:'', filetype:''});
          //set lastVerified in imports table to this firstid
          this.import.importid = result.importid;
          this.import.lastverified = result.firstid;
          this.itemService.updateImportsLastVerified(this.import)
            .subscribe((item: Import) => {
              //console.log('updated import');
            })

          this.itemService.setSelectedItem(parseInt(result.firstid), true);
        })
    }
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