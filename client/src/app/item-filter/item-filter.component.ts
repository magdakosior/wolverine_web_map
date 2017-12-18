import { Component } from '@angular/core';

import { DialogRef, ModalComponent } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';

export class ItemFilterModalData extends BSModalContext {
  constructor(public num1: number, public num2: number) {
    super();
  }
}

@Component({
  selector: 'item-filter-modal',
  styles: [`
        .custom_modal_content {
            padding: 15px;
            top: 30px;
            left: 200px;
            right: 200px;
        }
        .modal-open {
          top: 0;
          left: 0;
          width: 50%;
          height: 50%;

        }
        .bs-modal-container {
          top: 30px;
          left: 0;
          height: 50%;
          width: 50%;
      }
        .custom-modal-header {
            background-color: #219161;
            color: #fff;
            -webkit-box-shadow: 0px 3px 5px 0px rgba(0,0,0,0.75);
            -moz-box-shadow: 0px 3px 5px 0px rgba(0,0,0,0.75);
            box-shadow: 0px 3px 5px 0px rgba(0,0,0,0.75);
            margin-top: -15px;
            margin-bottom: 40px;
        }
    `],template: `
        <div class="container-fluid custom_modal_content">
            <div class="row custom-modal-header">
                <div class="col-sm-12">
                    <h1>Filter Options</h1>
                </div>
            </div>
            <div class="row" [ngClass]="{'myclass' : shouldUseMyClass}">
                <div class="col-xs-12">
                    
                    <h1>Do the math to quit:</h1>
                    <p class="lead">I received an injection of the number <strong>{{context.num1}}</strong> and the number <strong>{{context.num2}}</strong></p>
                    
                    <button class="btn btn-primary" (click)="onFilter()">Apply Filter</button>  <button class="btn btn-primary" (click)="onCancel()">Cancel</button>
                    
                </div>
            </div>
        </div>`
})
export class ItemFilterModal implements ModalComponent<ItemFilterModalData> {
  context: ItemFilterModalData;

  public wrongAnswer: boolean;

  constructor(public dialog: DialogRef<ItemFilterModalData>) {
    this.context = dialog.context;
    this.wrongAnswer = true;
  }

  onKeyUp(value) {
    this.wrongAnswer = value != 5;
    this.dialog.close();
  }
  onCancel(value) {
    this.dialog.close();
  }

  beforeDismiss(): boolean {
    return true;
  }

  beforeClose(): boolean {
    return this.wrongAnswer;
  }
}