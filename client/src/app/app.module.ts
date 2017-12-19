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

//import { ItemFilterModal } from './item-filter/item-filter.component';

import { ngxModal } from './item-filter/ngx.component';
import { ModalModule } from 'ngx-bootstrap';
//import {SelectModule} from 'ng2-select';


@NgModule({
  declarations: [
    AppComponent,
    ItemsComponent,
    ItemPhotoComponent,
    ItemDetailComponent,
    MessagesComponent,
    DashboardComponent,
    ItemSearchComponent,
    ngxModal
    //ItemFilterModal
  ],
  imports: [
    BrowserModule,
  	FormsModule,
  	AppRoutingModule,
    HttpClientModule,
    MapModule,
    BrowserModule,
    ModalModule.forRoot()//,
    //SelectModule
  ],
  providers: [ ItemService, MessagesComponent, MessageService ], //MapServiceprovided the HeroService in the root AppModule so that it can be injected anywhere.
  bootstrap: [AppComponent],
  entryComponents: [ ngxModal ]
})

export class AppModule { }
