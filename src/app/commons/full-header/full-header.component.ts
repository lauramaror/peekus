import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-full-header',
  templateUrl: './full-header.component.html',
  styles : [`
        :host {
            display: block;
        }
    `]
})
export class FullHeaderComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

}
