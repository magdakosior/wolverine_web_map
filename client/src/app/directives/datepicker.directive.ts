import { Input, Output, EventEmitter, ViewChild, ElementRef, Directive, Renderer } from '@angular/core';

@Directive({
  selector: '[datepicker]'
})

export class DatepickerDirective {
  @Output()
  change:EventEmitter<string> = new EventEmitter();

  constructor(private elementRef:ElementRef) {
  }

  ngOnInit() {
    this.elementRef.nativeElement.datepicker({
      onSelect: (dateText) => {
        this.change.emit(dateText);
      }
    });
  }
}