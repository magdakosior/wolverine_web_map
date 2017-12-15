import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MapComponent }      from './map/map.component';
import { ItemComponent }      from './item/item.component';
import { DashboardComponent }   from './dashboard/dashboard.component';
import { ItemPhotoComponent }  from './item-photo/item-photo.component';
import { ItemDetailComponent }  from './item-detail/item-detail.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'detail/:id', component: ItemDetailComponent },
  { path: 'heroes', component: ItemComponent }//,
  //{ path: 'map', component: MapComponent }
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

