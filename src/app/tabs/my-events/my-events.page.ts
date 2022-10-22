import { Component, OnInit } from '@angular/core';
import { Event } from 'src/app/models/event.model';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-my-events',
  templateUrl: 'my-events.page.html',
  styleUrls: ['my-events.page.scss']
})
export class MyEventsPage implements OnInit {

  eventsList: Event[] = [];
  loading = true;

  constructor(
    private eventService: EventService
  ) {}

  ngOnInit(): void{
    this.getEventsList();
  }

  getEventsList(){
    this.eventService.getEvents().subscribe(e=>{
      this.eventsList = e as Event[];
      this.loading = false;
    });
  }

}
