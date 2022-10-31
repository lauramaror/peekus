import { Component, Input, OnInit } from '@angular/core';
import { EventPeekusStatus } from 'src/app/helpers/enums';
import { EventPeekus } from 'src/app/models/event.model';
import { optionsByStatusMap, optionsByTypeMap } from 'src/app/helpers/options-maps';

@Component({
  selector: 'app-event-status-badge',
  templateUrl: './event-status-badge.component.html',
  styleUrls: ['./event-status-badge.component.scss'],
})
export class EventStatusBadgeComponent implements OnInit {
  @Input() event: EventPeekus;

  eventStatus = EventPeekusStatus;
  optionsByStatusMap = optionsByStatusMap;
  optionsByTypeMap = optionsByTypeMap;

  constructor() { }

  ngOnInit() {}

}
