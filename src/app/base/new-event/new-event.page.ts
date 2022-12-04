/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable arrow-body-style */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatetimeChangeEventDetail, NavController, ToastController } from '@ionic/angular';
import { of, zip } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { EventPeekus } from 'src/app/models/event.model';
import { EventService } from 'src/app/services/event.service';
import { StorageService } from 'src/app/services/storage.service';
import { IonModal } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { LocalNotifications } from '@capacitor/local-notifications';

@Component({
  selector: 'app-new-event',
  templateUrl: './new-event.page.html',
  styleUrls: ['./new-event.page.scss'],
})
export class NewEventPage implements OnInit {

  eventId = '';
  userId = '';
  loading = false;
  savingParticipants = false;
  savingEvent = false;
  eventForm: FormGroup;
  startDate: string;
  startHour: string;
  endHour: string;
  currentType = '';
  participantsList = [];
  backButtonText = 'Crear Evento';
  routerBackUrl = '/pk/tabs/my-events';
  eventData: EventPeekus;
  // usersList = [];


  constructor(
    private route: ActivatedRoute,
    private toastController: ToastController,
    private formBuilder: FormBuilder,
    private router: Router,
    private eventService: EventService,
    private storageService: StorageService,
    private navController: NavController,
    private userService: UserService,

    ) {
      this.eventForm = this.formBuilder.group({
        name: ['',Validators.required],
        description: [''],
        type: ['',Validators.required],
        capacity: [''],
        secretCode: [''],
      });
      const now = new Date();
      now.setUTCHours(now.getHours());
      this.startDate = now.toISOString();
      this.startHour = now.toISOString();
      this.endHour = this.startHour.split(':')[0] + ':'
                    + (parseInt(this.startHour.split(':')[1], 10)+1).toString()
                    + ':'+ this.startHour.split(':')[2];
    }

  ngOnInit() {
    this.eventId = this.route.snapshot.params.id;
    if(this.eventId){
      this.backButtonText = 'Editar Evento';
      this.routerBackUrl = '/pk/base/detail/'+this.eventId;
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
    this.eventData.createdDate = new Date(this.eventData.createdDate);
    this.eventData.createdDate.setHours(this.eventData.createdDate.getHours()+2);
    this.eventData.startDate = new Date(this.eventData.startDate);
    this.eventData.startDate.setHours(this.eventData.startDate.getHours()+2);
    this.eventData.endDate = new Date(this.eventData.endDate);
    this.eventData.endDate.setHours(this.eventData.endDate.getHours()+2);

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

  getMinEndDate(){
    return this.startHour ?
          this.startHour.split(':')[0] + ':'+ (parseInt(this.startHour.split(':')[1], 10)+1).toString() + ':'+ this.startHour.split(':')[2]
          : null;
  }

  saveEvent(){
    if(!this.eventForm.valid ||
      !((this.currentType==='private' && this.eventForm.get('secretCode').value) || this.currentType!=='private')){
      this.presentToast('Rellena los campos obligatorios');
      return;
    }
      this.savingEvent = true;

      const startDateToPost = new Date(this.startDate);
      startDateToPost.setHours(new Date(this.startHour.split('Z')[0]).getHours());
      startDateToPost.setMinutes(new Date(this.startHour.split('Z')[0]).getMinutes());
      startDateToPost.setSeconds(0);
      const endDateToPost = new Date(this.startDate);
      endDateToPost.setHours(new Date(this.endHour.split('Z')[0]).getHours());
      endDateToPost.setMinutes(new Date(this.endHour.split('Z')[0]).getMinutes());
      endDateToPost.setSeconds(0);

      const newEvent = {
        name: this.eventForm.get('name').value,
        description: this.eventForm.get('description').value,
        startDate: startDateToPost.toISOString(),
        endDate: endDateToPost.toISOString(),
        capacity: this.eventForm.get('capacity').value || 100,
        creator: this.userId,
        type: this.currentType.toUpperCase(),
        status: 'NEXT'
      };
      this.participantsList.push({idEvent: null, idParticipant: this.userId});
      if(this.eventId){
        this.eventService.updateEvent(newEvent, '?id='+this.eventId).pipe().subscribe(p=>{
            this.savingEvent = false;
            this.navController.navigateRoot(['/pk/base/detail', this.eventId]);
        });
      }
      else{
        this.eventService.saveEvent(newEvent).pipe(
          map(event=> {
            this.eventId = event['idEvent'];
            return event['idEvent'];
          }),
          mergeMap(eventId=>{
            this.participantsList.forEach(p=>p.idEvent = eventId);
            return zip(
              this.eventService.saveParticipantsList(this.participantsList),
              this.eventForm.get('secretCode').value
              ? this.eventService.saveCode({idEvent: eventId, type: 'numeric', codeContent: this.eventForm.get('secretCode').value})
              : of(null),
              this.eventService.saveCodeQR('?idEvent='+eventId)
            );
          })).subscribe(([participants, code, qr])=>{
            LocalNotifications.schedule({
              notifications: [{
                title: 'Comienzo de evento',
                body: 'Tue evento '+newEvent.name+' acaba de comenzar',
                id: Math.random(),
                schedule: {at: new Date(startDateToPost)}
              }]
            });
            this.savingEvent = false;
            this.navController.navigateRoot(['/pk/base/detail', this.eventId]);
        });
      }
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1500,
      position: 'bottom',
      cssClass: 'my-custom-toast'
    });

    await toast.present();
  }


}
