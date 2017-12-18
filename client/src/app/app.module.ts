import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here
import { HttpClientModule } from '@angular/common/http';
//import { leaflet } from 'leaflet';

import { AppComponent } from './app.component';
import { ItemsComponent } from './items/items.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { ItemPhotoComponent } from './item-photo/item-photo.component';
import { ItemDetailComponent } from './item-detail/item-detail.component';
import { ItemService } from './item.service';
import { MessagesComponent } from './messages/messages.component';
import { MessageService } from './message.service';
import { AppRoutingModule } from './app-routing.module';
import { ItemSearchComponent } from './item-search/item-search.component';
import { MapModule } from './map/map.module';

import { ItemFilterModal } from './item-filter/item-filter.component';

//import { ModalModule } from 'angular2-modal';
//import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';
import { ModalModule } from 'ngx-modialog';
import { BootstrapModalModule } from 'ngx-modialog/plugins/bootstrap';
//import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//import { ModalService } from 'ngx-bootstrap/modal';

//import { ModalDirective } from 'ngx-bootstrap/modal';
//import { LeafletModule } from '@asymmetrik/angular2-leaflet';
//import { MapService } from "./services/map.service";


@NgModule({
  declarations: [
    AppComponent,
    ItemsComponent,
    ItemPhotoComponent,
    ItemDetailComponent,
    MessagesComponent,
    DashboardComponent,
    ItemSearchComponent,
    ItemFilterModal,

  ],
  imports: [
    BrowserModule,
  	FormsModule,
  	AppRoutingModule,
    HttpClientModule,
    MapModule,
    BrowserModule, 
    ModalModule.forRoot(),
    BootstrapModalModule
    //BootstrapModalModule
    //ModalService.forRoot()
    //LeafletModule.forRoot()
  ],
  providers: [ ItemService, MessagesComponent, MessageService ], //MapServiceprovided the HeroService in the root AppModule so that it can be injected anywhere.
  bootstrap: [AppComponent],
  entryComponents: [ ItemFilterModal ]
})

export class AppModule { }
