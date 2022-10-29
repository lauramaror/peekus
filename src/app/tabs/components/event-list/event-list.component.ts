import { Component, Input, OnInit } from '@angular/core';
import { EventPeekus } from 'src/app/models/event.model';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
})
export class EventListComponent implements OnInit {
  @Input() events: EventPeekus[];

  ascDate = true;
  ascName = true;

  constructor() { }

  ngOnInit() {
    this.events = this.events.sort((a,b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  }

  orderByDate(){
    this.events = this.ascDate ? this.events.sort((a,b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
                          : this.events.sort((a,b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    this.ascDate = !this.ascDate;
  }

  orderByName(){
    this.events = this.ascName ? this.events.sort((a,b) => a.name.localeCompare(b.name))
                          : this.events.sort((a,b) => b.name.localeCompare(a.name));
    this.ascName = !this.ascName;
  }

}
