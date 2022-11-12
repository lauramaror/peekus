import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-peekus-back-button',
  templateUrl: './peekus-back-button.component.html',
  styleUrls: ['./peekus-back-button.component.scss'],
})
export class PeekusBackButtonComponent implements OnInit {
  @Input() backButtonText: string;
  @Input() routerUrl: string;
  @Input() iconName: string;
  @Input() actionIcon: string;
  @Input() actionOption: number;

  @Output() actionToPerform = new EventEmitter<string>();

  actionByOption = [{},{text:'Generar collage', emitName:'generate'},{text:'Actualizar estado', emitName:'update'}];

  constructor() { }

  ngOnInit() {
  }

  download(){
    this.actionToPerform.emit('download');
  }

  generate(){
    this.actionToPerform.emit(this.actionByOption[this.actionOption].emitName);
  }

}
