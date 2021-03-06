import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // <-- NgModel lives here
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { MapComponent } from './map/map.component';
import { LeafletMarkerClusterModule } from './leaflet-markercluster/leaflet-markercluster.module';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { ItemPhotoComponent } from './item-photo/item-photo.component';
import { ItemDetailComponent } from './item-detail/item-detail.component';

import { ItemService } from './item.service';
import { MessagesComponent } from './messages/messages.component';
import { MessageService } from './message.service';
import { ItemSearchComponent } from './item-search/item-search.component';

import { filterModal } from './item-filter/filter.component';
import { importModal } from './import/import.component';

import { ModalModule } from 'ngx-bootstrap';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';

import { MatButtonModule, MatSidenavModule, MatIconModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    ItemPhotoComponent,
    ItemDetailComponent,
    MessagesComponent,
    ItemSearchComponent,
    filterModal,
    importModal
  ],
  imports: [
    BrowserModule,
  	FormsModule,
    ReactiveFormsModule,
  	AppRoutingModule,
    HttpClientModule,
    LeafletModule,
    LeafletMarkerClusterModule,
    ModalModule.forRoot(),
    AngularMultiSelectModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    BrowserAnimationsModule
  ],
  providers: [ ItemService, MessagesComponent, MessageService ], //MapServiceprovided the HeroService in the root AppModule so that it can be injected anywhere.
  bootstrap: [AppComponent],
  entryComponents: [ filterModal, importModal ]
})

export class AppModule { }
