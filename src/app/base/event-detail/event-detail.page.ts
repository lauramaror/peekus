import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { mergeMap } from 'rxjs/operators';
import { EventPeekus } from 'src/app/models/event.model';
import { EventService } from 'src/app/services/event.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.page.html',
  styleUrls: ['./event-detail.page.scss'],
})
export class EventDetailPage implements OnInit {

  loading = true;
  eventId = '';
  eventData: EventPeekus;
  backButtonText = 'Mis eventos';
  userId = '';

  constructor(
    private route: ActivatedRoute,
    private storageService: StorageService,
    private eventService: EventService,
    ) { }

  ngOnInit() {
    this.eventId = this.route.snapshot.params.id;
    this.getEvent();
  }

  getEvent(){
    this.loading = true;
    this.storageService.getUserInfo().pipe(mergeMap(userInfo=>{
      this.userId = userInfo.id;
      const params = '?participant='+userInfo.id+'&id='+this.eventId;
      return this.eventService.getEvents(params);
    })).subscribe(e=>{
      this.eventData = e[0] as EventPeekus;
      this.loading = false;
    });
  }

}
