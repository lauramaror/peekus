import { Component, Input, OnInit } from '@angular/core';
import { EventPeekus } from 'src/app/models/event.model';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
})
export class EventListComponent implements OnInit {
  @Input() events: EventPeekus[];

  constructor() { }

  ngOnInit() {}

}
