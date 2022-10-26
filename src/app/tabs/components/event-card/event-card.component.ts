import { Component, Input, OnInit } from '@angular/core';
import { EventStatus, EventType } from 'src/app/helpers/enums';
import { Event } from 'src/app/models/event.model';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss'],
})
export class EventCardComponent implements OnInit {
  @Input() event: Event;

  eventStatus = EventStatus;
  eventStartDate = '';
  startHour = '';
  endHour = '';

  optionsByStatusMap = new Map<EventStatus, any>([
    [EventStatus.NEXT, {bgColor: '#789FD9', iconBar: 'time', colorDate: '#6B6B6B'}],
    [EventStatus.ONGOING, {bgColor: '#BD2742', iconBar: 'alert', colorDate: '#BD2742',
                          bgColorCompleted:'#E7CC6F', iconBarCompleted: 'camera', colorDateCompleted: '#6B6B6B'}],
    [EventStatus.FINISHED, {bgColor: '#6F4970', iconBar: 'checkmark', colorDate: '#6B6B6B'}]
  ]);

  optionsByTypeMap = new Map<EventType, any>([
    [EventType.EXCLUSIVE, {icon: 'star'}],
    [EventType.PRIVATE, {icon: 'lock-closed'}],
    [EventType.PUBLIC, {icon: 'earth'}],
  ]);

  constructor() { }

  ngOnInit() {
    const eventDate = new Date(this.event.startDate);
    this.eventStartDate = eventDate.getDate() + '/' + eventDate.getMonth() + '/' + eventDate.getFullYear();
    this.startHour = eventDate.getHours() + ':' + eventDate.getMinutes();
  }

}
