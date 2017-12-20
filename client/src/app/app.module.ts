import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { MapComponent } from './map/map.component';
import { LeafletMarkerClusterModule } from './leaflet-markercluster/leaflet-markercluster.module';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

//import { DashboardComponent } from './dashboard/dashboard.component';
import { ItemPhotoComponent } from './item-photo/item-photo.component';
import { ItemDetailComponent } from './item-detail/item-detail.component';

import { ItemService } from './item.service';
import { MessagesComponent } from './messages/messages.component';
import { MessageService } from './message.service';
import { ItemSearchComponent } from './item-search/item-search.component';

import { ItemsComponent } from './items/items.component';

//import { ItemFilterModal } from './item-filter/item-filter.component';

import { ngxModal } from './item-filter/ngx.component';
import { ModalModule } from 'ngx-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    ItemsComponent,
    ItemPhotoComponent,
    ItemDetailComponent,
    MessagesComponent,
    //DashboardComponent,
    ItemSearchComponent,
    ngxModal
    //ItemFilterModal
  ],
  imports: [
    BrowserModule,
  	FormsModule,
  	AppRoutingModule,
    HttpClientModule,
    LeafletModule,
    LeafletMarkerClusterModule,
    ModalModule.forRoot()
  ],
  providers: [ ItemService, MessagesComponent, MessageService ], //MapServiceprovided the HeroService in the root AppModule so that it can be injected anywhere.
  bootstrap: [AppComponent]//,
  //entryComponents: [ ngxModal ]
})

export class AppModule { }
