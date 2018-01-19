import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MapComponent }      from './map/map.component';
import { ItemPhotoComponent }  from './item-photo/item-photo.component';
import { ItemDetailComponent }  from './item-detail/item-detail.component';

const routes: Routes = [
  { path: '', redirectTo: '/map', pathMatch: 'full' },
  { path: 'detail', component: ItemDetailComponent },
  { path: 'map', component: MapComponent }
];

/*
The method is called forRoot() because you configure the router at the application's root level. 
The forRoot() method supplies the service providers and directives needed for routing, 
and performs the initial navigation based on the current browser URL.
*/
@NgModule({
	imports: [ RouterModule.forRoot(routes) ],
  	exports: [ RouterModule ]
})
export class AppRoutingModule {} 
//Exporting RouterModule makes router directives available for use in the AppModule components that will need them.

