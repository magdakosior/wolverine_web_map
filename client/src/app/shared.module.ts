import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HighlightDirective } from './directives/highlight.directive';
import { DatepickerDirective } from './directives/datepicker.directive';

//import { exif } from 'exif-js/exif';


@NgModule({
  declarations: [
    DatepickerDirective
  ],
  imports: [
  	FormsModule,
    RouterModule
  ],
  providers: [ ], 
  exports: [DatepickerDirective]
})

export class SharedModule { }
