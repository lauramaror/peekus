/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable arrow-body-style */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatetimeChangeEventDetail, NavController, ToastController } from '@ionic/angular';
import { zip } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { EventPeekus } from 'src/app/models/event.model';
import { EventService } from 'src/app/services/event.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-new-event',
  templateUrl: './new-event.page.html',
  styleUrls: ['./new-event.page.scss'],
})
export class NewEventPage implements OnInit {

  eventId = '';
  userId = '';
  loading = false;
  savingEvent = false;
  eventForm: FormGroup;
  startDate: string;
  startHour: string;
  endHour: string;
  currentType = '';
  participantsList = [];
  backButtonText = 'Crear Evento';
  routerBackUrl = '/tabs/my-events';
  eventData: EventPeekus;

  constructor(
    private route: ActivatedRoute,
    private toastController: ToastController,
    private formBuilder: FormBuilder,
    private router: Router,
    private eventService: EventService,
    private storageService: StorageService,
    private navController: NavController,
    ) {
      this.eventForm = this.formBuilder.group({
        name: ['',Validators.required],
        description: [''],
        type: ['',Validators.required],
        capacity: [''],
        secretCode: [''],
      });
      this.startDate = new Date().toISOString();
      this.startHour = new Date().toISOString();
      this.endHour = new Date().toISOString();
    }

  ngOnInit() {
    this.eventId = this.route.snapshot.params.id;
    if(this.eventId){
      this.backButtonText = 'Editar Evento';
      this.routerBackUrl = '/base/detail/'+this.eventId;
      this.getEvent();
    }else{
      this.storageService.getUserInfo().pipe().subscribe(u=>this.userId=u.id);
    }
  }

  getEvent(){
    this.loading = true;
    this.storageService.getUserInfo().pipe(map(userInfo=>{
      this.userId = userInfo.id;
      return '?user='+userInfo.id+'&id='+this.eventId;
    }), mergeMap(params=> {
      return zip(
        this.eventService.getEvents(params),
        this.eventService.getParticipantsByEvent('?idEvent='+this.eventId),
      );
    })).subscribe(([event, participants])=>{
      this.eventData = event[0] as EventPeekus;
      this.eventData.likedByUser = event[0].likedByUser === 1;
      this.eventData.completedByUser = event[0].completedByUser === 1;
      this.participantsList = participants as [];
      this.setEventValues();
      this.loading = false;
    });
  }

  setEventValues(){
    this.startDate = new Date(this.eventData.startDate).toISOString();
    this.startHour = new Date(this.eventData.startDate).toISOString();
    this.endHour = new Date(this.eventData.endDate).toISOString();
    this.currentType = this.eventData.type.toLowerCase();
    this.eventForm.setValue({name: this.eventData.name, description: this.eventData.description,
                            type: this.currentType, capacity: this.eventData.capacity, secretCode: ''});
  }

  changeType(e) {
    this.currentType = e.detail.value;
  }

  saveEvent(){
    if(this.eventForm.valid){
      this.savingEvent = true;

      const startDateToPost = new Date(this.startDate);
      startDateToPost.setHours(new Date(this.startHour).getHours());
      startDateToPost.setMinutes(new Date(this.startHour).getMinutes());
      const endDateToPost = new Date(this.startDate);
      endDateToPost.setHours(new Date(this.endHour).getHours());
      endDateToPost.setMinutes(new Date(this.endHour).getMinutes());

      const newEvent = {
        name: this.eventForm.get('name').value,
        description: this.eventForm.get('description').value,
        startDate: startDateToPost.toISOString(),
        endDate: endDateToPost.toISOString(),
        capacity: this.eventForm.get('capacity').value,
        creator: this.userId,
        type: this.currentType.toUpperCase(),
        status: 'NEXT'
      };
      this.participantsList.push({idEvent: null, idParticipant: this.userId});
      if(this.eventId){
        // this.eventService.updateEvent(newEvent).pipe(
        //   map(event=> {
        //     return event['idEvent'];
        //   }),
        //   mergeMap(eventId=>{
        //     this.participantsList.forEach(p=>p.idEvent = eventId);
        //     return this.eventService.saveParticipantsList(this.participantsList);
        //   })).subscribe(p=>{
        //     this.savingEvent = false;
        //     this.navController.navigateRoot(['/tabs/my-events']);
        // });
      }
      else{
        this.eventService.saveEvent(newEvent).pipe(
          map(event=> {
            return event['idEvent'];
          }),
          mergeMap(eventId=>{
            this.participantsList.forEach(p=>p.idEvent = eventId);
            return this.eventService.saveParticipantsList(this.participantsList);
          })).subscribe(p=>{
            this.savingEvent = false;
            this.navController.navigateRoot(['/tabs/my-events']);
        });
      }
    }
  }


}