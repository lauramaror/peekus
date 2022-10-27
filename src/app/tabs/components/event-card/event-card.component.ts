import { Component, Input, OnInit } from '@angular/core';
import { EventPeekusStatus, EventPeekusType } from 'src/app/helpers/enums';
import { EventPeekus } from 'src/app/models/event.model';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss'],
})
export class EventCardComponent implements OnInit {
  @Input() event: EventPeekus;

  eventStatus = EventPeekusStatus;
  startHour = '';
  endHour = '';

  optionsByStatusMap = new Map<EventPeekusStatus, any>([
    [EventPeekusStatus.NEXT, {bgColor: '#789FD9', iconBar: 'time', colorDate: '#6B6B6B'}],
    [EventPeekusStatus.ONGOING, {bgColor: '#BD2742', iconBar: 'alert', colorDate: '#BD2742',
                          bgColorCompleted:'#E7CC6F', iconBarCompleted: 'camera', colorDateCompleted: '#6B6B6B'}],
    [EventPeekusStatus.FINISHED, {bgColor: '#6F4970', iconBar: 'checkmark', colorDate: '#6B6B6B'}]
  ]);

  optionsByTypeMap = new Map<EventPeekusType, any>([
    [EventPeekusType.EXCLUSIVE, {icon: 'star'}],
    [EventPeekusType.PRIVATE, {icon: 'lock-closed'}],
    [EventPeekusType.PUBLIC, {icon: 'earth'}],
  ]);

  constructor() { }

  ngOnInit() {
    this.startHour = this.getFixedHour(this.event.startDate);
    this.endHour = this.getFixedHour(this.event.endDate);
  }

  getFixedHour(hour: Date){
    const eventHour = hour ? new Date(hour) : null;
    return eventHour ? eventHour.getHours() + ':' + (eventHour.getMinutes() === 0 ? '00' : eventHour.getMinutes()) : '';
  }

}
