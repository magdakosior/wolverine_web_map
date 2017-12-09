import { NgModule } from '@angular/core';

 // Local Imports
import { MapComponent } from './map.component';
import { LeafletMarkerClusterModule } from '../leaflet-markercluster/leaflet-markercluster.module';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';


@NgModule({
	imports: [
		LeafletModule,
		LeafletMarkerClusterModule
	],
	declarations: [
		MapComponent
	],
	exports: [
		MapComponent
	],
	bootstrap: [ MapComponent ],
	providers: [ ]
})
export class MapModule { }
