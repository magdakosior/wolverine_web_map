import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here
import { HttpClientModule } from '@angular/common/http';
//import { leaflet } from 'leaflet';

import { AppComponent } from './app.component';
import { ItemComponent } from './item/item.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { ItemPhotoComponent } from './item-photo/item-photo.component';
import { ItemDetailComponent } from './item-detail/item-detail.component';
import { ItemService } from './item.service';
import { MessagesComponent } from './messages/messages.component';
import { MessageService } from './message.service';
import { AppRoutingModule } from './/app-routing.module';
import { ItemSearchComponent } from './item-search/item-search.component';
import { MapModule } from './map/map.module';

//import { LeafletModule } from '@asymmetrik/angular2-leaflet';
//import { MapService } from "./services/map.service";


@NgModule({
  declarations: [
    AppComponent,
    ItemComponent,
    ItemPhotoComponent,
    ItemDetailComponent,
    MessagesComponent,
    DashboardComponent,
    ItemSearchComponent
  ],
  imports: [
    BrowserModule,
  	FormsModule,
  	AppRoutingModule,
    HttpClientModule,
    MapModule//,
    //LeafletModule.forRoot()
  ],
  providers: [ ItemService, MessagesComponent, MessageService ], //MapServiceprovided the HeroService in the root AppModule so that it can be injected anywhere.
  bootstrap: [AppComponent]
})

export class AppModule { }
