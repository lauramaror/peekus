import { Component, OnInit } from '@angular/core';
import { EventPeekus } from 'src/app/models/event.model';
import { EventService } from '../../services/event.service';
import { UserService } from '../../services/user.service';
import { StorageService } from '../../services/storage.service';
import { mergeMap, take, tap } from 'rxjs/operators';
import { NavController, ViewWillEnter } from '@ionic/angular';

@Component({
  selector: 'app-my-events',
  templateUrl: 'my-events.page.html',
  styleUrls: ['my-events.page.scss']
})
export class MyEventsPage implements OnInit {

  eventsList: EventPeekus[] = [];
  loading = true;
  statusParams = '';
  completedEvents = false;
  creatorOnlyMe = false;
  creatorOnlyOthers = false;
  userId = '';

  constructor(
    private eventService: EventService,
    private userService: UserService,
    private storageService: StorageService,
    private navController: NavController,
  ) {}

  ngOnInit(): void{
    this.getEventsList();
  }

  // ionViewWillEnter(){ console.log('ionViewWillEnter');
  //   this.getEventsList();
  // }

  // createEvent(){
  //   this.navController.navigateRoot(['/base/edit']);
  // }

  changeStatuses(e) {
    const statusesToSearch = [...e.detail.value];
    const includesCompleted = statusesToSearch.indexOf('COMPLETED');
    if(includesCompleted>-1){
      this.completedEvents = true;
      statusesToSearch.splice(includesCompleted, 1);
      if(!statusesToSearch.includes('ONGOING')) { statusesToSearch.push('ONGOING'); }
    }
    this.statusParams = '';
    if(statusesToSearch.length){
      this.statusParams = '&status=\'' + statusesToSearch.join('\',\'') + '\'';
    }
    this.getEventsList();
  }

  changeCreators(e) {
    const creatorsToFilter = e.detail.value;
    this.creatorOnlyMe = creatorsToFilter.includes('ME') && !creatorsToFilter.includes('OTHERS');
    this.creatorOnlyOthers = !creatorsToFilter.includes('ME') && creatorsToFilter.includes('OTHERS');
    if(creatorsToFilter.length===0){
      creatorsToFilter.push('ME', 'OTHERS');
    }
    this.getEventsList();
  }

  getEventsList(){
    this.loading = true;
    this.storageService.getUserInfo().pipe(mergeMap(userInfo=>{
      this.userId = userInfo.id;
      const params = '?participant='+userInfo.id+this.statusParams;
      return this.eventService.getEvents(params);
    })).subscribe(e=>{
      this.eventsList = e as EventPeekus[];
      if(this.completedEvents){
        this.eventsList = this.eventsList.filter(eventsToFilter=>eventsToFilter.completedByUser);
      }
      if(this.creatorOnlyMe){
        this.eventsList = this.eventsList.filter(eventToFilter=>eventToFilter.creator === this.userId);
      }
      if(this.creatorOnlyOthers){
        this.eventsList = this.eventsList.filter(eventToFilter=>eventToFilter.creator !== this.userId);
      }
      this.eventsList = this.eventsList.sort((a,b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
      this.loading = false;
    });
  }

}
