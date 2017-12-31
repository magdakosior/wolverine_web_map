import { Directive,HostListener,Output,EventEmitter } from '@angular/core';

@Directive({
///appCollar is the collar!
  selector: '[app-item-import]'//,
  //host: {'(window:keydown)': 'hotkeys($event)'}
})
export class EventListenerDirective {  
	keyCode: number;
  

/// Event Emitter used to communicate the act of scratching to the dog
  @Output() itch:EventEmitter<any> = new EventEmitter();


/// our click is a representation of a scratch
  //@HostListener('onClick') onClick(){
///We are emitting itchies!!
	//console.log('in itch directive');
    //this.itch.emit('itch itch itch');
  //}

  @HostListener('window:keydown', ['$event'])
  keyboardInput(event: KeyboardEvent) {
    console.log('keyboard event in item-detail');
    
    event.preventDefault();
    event.stopPropagation();
    
    this.keyCode = event.keyCode;
    console.log(this.keyCode);

    this.itch.emit('itch itch itch');

    //this.applyFilter();
    //}
  }

  constructor() { }

}