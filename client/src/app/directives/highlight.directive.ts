import { Directive,HostListener,Output,EventEmitter } from '@angular/core';


@Directive({
  selector: '[tohHighlight]'
})
export class HighlightDirective {
	@Output() itch:EventEmitter<any> = new EventEmitter();
	keyCode: number;

  @HostListener('keydown', ['$event'])
  keyboardInput(event: KeyboardEvent) {
    console.log('keyboard event in directive');
    
    event.preventDefault();
    event.stopPropagation();
    
    this.keyCode = event.keyCode;
    console.log(this.keyCode);

    this.itch.emit(event.keyCode);

    //this.applyFilter();
    //}
  }
}