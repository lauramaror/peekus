/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable arrow-body-style */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatetimeChangeEventDetail, ToastController } from '@ionic/angular';
import { mergeMap } from 'rxjs/operators';
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

  constructor(
    private route: ActivatedRoute,
    private toastController: ToastController,
    private formBuilder: FormBuilder,
    private router: Router,
    private eventService: EventService,
    private storageService: StorageService,
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
    console.log('evento',this.eventId);
    this.storageService.getUserInfo().pipe().subscribe(u=>this.userId=u.id);
  }

  changeType(e) {
    this.currentType = e.detail.value;
  }

  saveEvent(){
    console.log('saveEvent');
    if(this.eventForm.valid){
      console.log('valido');
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
      this.participantsList.push(this.userId);
      console.log('newEvent',newEvent);
      if(this.eventId){

      }
      else{
        this.eventService.saveEvent(newEvent).pipe(
          mergeMap(event=>this.eventService.saveParticipants(this.participantsList, event['idEvent']))).subscribe(participants=>{
            this.savingEvent = false;
            this.router.navigateByUrl('/tabs/my-events');
        });
      }
    }
  }


}
