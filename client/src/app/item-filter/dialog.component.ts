import { Component, OnInit, Input, Output, OnChanges, EventEmitter } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'item-filter-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
  animations: [
    trigger('dialog', [
      transition('void => *', [
        style({ transform: 'scale3d(.3, .3, .3)' }),
        animate(100)
      ]),
      transition('* => void', [
        animate(100, style({ transform: 'scale3d(.0, .0, .0)' }))
      ])
    ])
  ]
})
export class DialogComponent implements OnInit {
  @Input() closable = true;
  @Input() visible: boolean;
  @Input() modaltext?:string;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() { 
    //load stuff from db here
    this.modaltext = 'helllooo';
  }

  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }
}