import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-peekus-back-button',
  templateUrl: './peekus-back-button.component.html',
  styleUrls: ['./peekus-back-button.component.scss'],
})
export class PeekusBackButtonComponent implements OnInit {
  @Input() backButtonText: string;

  constructor() { }

  ngOnInit() {}

}
