/* eslint-disable arrow-body-style */
import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
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
  textToSearch = '';
  paramsToSearch = '';
  page = 0;
  typeCheck = [true, true];

  constructor(
    private eventService: EventService,
    private userService: UserService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void{
    this.getEventsList();
  }

  getEventsList(){
    this.loading = true;
    this.storageService.getUserInfo().pipe(mergeMap(userInfo=>{
      if(!this.userId){
        this.userId = userInfo.id;
        this.paramsToSearch = '?user='+userInfo.id+'&type=\'PRIVATE\',\'PUBLIC\'';
      }
      let params = this.paramsToSearch;
      if(this.textToSearch){
        params+='&text='+this.textToSearch;
      }
      else {
        params+='&status=\'NEXT\',\'ONGOING\'';
      }
      return this.eventService.getEvents(params);
    })).subscribe(e=>{
      this.eventsList = e as EventPeekus[];
      this.eventsList = this.eventsList.sort((a,b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
      this.loading = false;
    });
  }

  buscarEvento(event) {
    this.textToSearch = event.target.value.toLowerCase();
    this.getEventsList();
  }

  filterByType(filters: boolean[]){
    this.paramsToSearch = '?user='+this.userId;
    this.typeCheck = filters;
    const types = [];
    if(filters[0]) {types.push('\'PUBLIC\'');}
    if(filters[1]) {types.push('\'PRIVATE\'');}
    this.paramsToSearch += types.length ? '&type='+types.join(',') : '';
    this.getEventsList();
  }

  addEventsNextPage(){
    let params = this.paramsToSearch+'&pageNum='+this.page;
    if(this.textToSearch){
      params+='&text='+this.textToSearch;
    }
    else {
      params+='&status=\'NEXT\',\'ONGOING\'';
    }
    this.eventService.getEvents(params).pipe().subscribe(e=>{
      (e as EventPeekus[]).forEach(ev=> {
        if(!this.eventsList.includes(ev)){
          this.eventsList.push(ev);
        }
      });
    });
  }

  onIonInfinite(ev) {
    this.page+=10;
    this.addEventsNextPage();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

}
