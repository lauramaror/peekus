import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { mergeMap, zip } from 'rxjs/operators';
import { optionsByTypeMap } from 'src/app/helpers/options-maps';
import { EventPeekus } from 'src/app/models/event.model';
import { EventService } from 'src/app/services/event.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.page.html',
  styleUrls: ['./event-detail.page.scss'],
})
export class EventDetailPage implements OnInit {

  optionsByTypeMap = optionsByTypeMap;

  loading = true;
  eventId = '';
  eventData: EventPeekus;
  backButtonText = 'Eventos';
  userId = '';
  createdDate = '';
  startDayWeek = '';
  startDayMonth = '';
  cancelButtonText = 'CANCELAR INSCRIPCIÓN';

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
      const params = '?user='+userInfo.id+'&id='+this.eventId;
      return this.eventService.getEvents(params);
    })).subscribe(e=>{
      this.eventData = e[0] as EventPeekus;

      const createdDateToFormat = new Date(this.eventData.createdDate);
      const createdMonth = new Intl.DateTimeFormat('es-ES', { month: 'short'}).format(createdDateToFormat);
      this.createdDate = createdDateToFormat.getDate() + ' '+createdMonth+'. ' + createdDateToFormat.getFullYear();
      const startDateToFormat = new Date(this.eventData.startDate);
      this.startDayMonth = new Intl.DateTimeFormat('es-ES', { month: 'short'}).format(startDateToFormat);
      this.startDayWeek = this.dayWeekName(startDateToFormat);

      this.loading = false;
    });
  }

  dayWeekName = fecha => [
    'DOM',
    'LUN',
    'MAR',
    'MIE',
    'JUE',
    'VIE',
    'SÁB',
  ][new Date(fecha).getDay()];

}
