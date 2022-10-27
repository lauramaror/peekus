import { Component, OnInit } from '@angular/core';
import { EventPeekus } from 'src/app/models/event.model';
import { EventService } from '../../services/event.service';
import { UserService } from '../../services/user.service';
import { StorageService } from '../../services/storage.service';
import { mergeMap, take, tap } from 'rxjs/operators';

@Component({
  selector: 'app-my-events',
  templateUrl: 'my-events.page.html',
  styleUrls: ['my-events.page.scss']
})
export class MyEventsPage implements OnInit {

  eventsList: EventPeekus[] = [];
  loading = true;
  statusParams = '';

  constructor(
    private eventService: EventService,
    private userService: UserService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void{
    this.getEventsList();
  }

  changeStatuses(e) {
    const statusesToSearch = e.detail.value;
    this.statusParams = '';
    if(statusesToSearch.length){
      this.statusParams = '&status=\'' + statusesToSearch.join('\',\'') + '\'';
    }
    this.getEventsList();
  }

  changeCreators(e) {
    console.log(e.detail.value);
  }

  getEventsList(){
    this.loading = true;
    this.storageService.getUserInfo().pipe(mergeMap(userInfo=>{
      const params = '?participant='+userInfo.id+this.statusParams;
      return this.eventService.getEvents(params);
    })).subscribe(e=>{
      this.eventsList = e as EventPeekus[];
      this.loading = false;
    });
  }

}
