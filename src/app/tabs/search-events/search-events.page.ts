/* eslint-disable arrow-body-style */
import { Component, OnInit } from '@angular/core';
import { mergeMap } from 'rxjs/operators';
import { EventPeekus } from 'src/app/models/event.model';
import { EventService } from 'src/app/services/event.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-search-events',
  templateUrl: 'search-events.page.html',
  styleUrls: ['search-events.page.scss']
})
export class SearchEventsPage implements OnInit {

  eventsList: EventPeekus[] = [];
  loading = true;
  userId = '';

  constructor(
    private eventService: EventService,
    private userService: UserService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void{
    this.getEventsList();
  }

  getEventsList(textToSearch?: string){
    this.storageService.getUserInfo().pipe(mergeMap(userInfo=>{
      this.userId = userInfo.id;
      let params = '?user='+userInfo.id+'&type=\'PRIVATE\',\'PUBLIC\'';
      if(textToSearch){
        params+='&text='+textToSearch;
      }
      return this.eventService.getEvents(params);
    })).subscribe(e=>{
      this.eventsList = e as EventPeekus[];
      this.eventsList = this.eventsList.sort((a,b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
      this.loading = false;
    });
  }

  buscarEvento(event) {
    const query = event.target.value.toLowerCase();
    this.getEventsList(query);
  }

}
