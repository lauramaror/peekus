/* eslint-disable @typescript-eslint/dot-notation */
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { EventPeekusStatus, EventPeekusType } from 'src/app/helpers/enums';
import { EventPeekus } from 'src/app/models/event.model';
import { optionsByStatusMap, optionsByTypeMap } from 'src/app/helpers/options-maps';
import { ImageService } from '../../../services/image.service';
import { mergeMap } from 'rxjs/operators';
import { EventService } from 'src/app/services/event.service';
import { AlertController, IonModal, NavController, ToastController } from '@ionic/angular';
import { presentAlert } from 'src/app/helpers/common-functions';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss'],
})
export class EventCardComponent implements OnInit {
  @ViewChild(IonModal) modal: IonModal;
  @Input() event: EventPeekus;
  @Input() userId: string;

  eventStatus = EventPeekusStatus;
  eventType = EventPeekusType;
  optionsByStatusMap = optionsByStatusMap;
  optionsByTypeMap = optionsByTypeMap;
  photo: any;
  savingPhoto = false;
  accessCode = '';
  eventCode = '';

  constructor(
    private imageService: ImageService,
    private eventService: EventService,
    private navController: NavController,
    private alertController: AlertController,
    private toastController: ToastController,

  ) { }

  ngOnInit() {
    if(this.event.type===EventPeekusType.PRIVATE){
      this.eventService.getCodes('?idEvent='+this.event.id+'&type=NUMERIC').pipe().subscribe(e=> this.eventCode=e[0]['content']);
    }
  }

  async takePhoto(){
    await this.imageService.takePhoto();
    this.photo = this.imageService.images[0];
    if(this.photo){
      this.savingPhoto = true;
      this.event.completedByUser = true;
      const params = '?type=event&idUser='+this.userId+'&idEvent='+this.event.id;
      this.imageService.startUpload(this.photo, params).pipe(mergeMap(photo=>{
        const idPhoto = photo['imgId'];
        const bodyToSend = {idParticipant: this.userId, idEvent: this.event.id, idImage: idPhoto, completed: 1};
        return this.eventService.updateParticipant(bodyToSend);
      })).subscribe(i=>{
        this.savingPhoto = false;
        this.navController.navigateRoot(['/tabs/my-events']);
      });
    }
  }

  async inscriptionEvent(){
    if(this.event.type === EventPeekusType.PUBLIC){
      const answer1 = await presentAlert('¿Quieres inscribirte al evento?', this.alertController);
      if(answer1==='confirm'){
        const participantToPost = {idEvent: this.event.id, idParticipant: this.userId};
        this.eventService.saveParticipant(participantToPost).pipe().subscribe(p=>{
            this.event.participants++;
            this.event.userParticipates = true;
            this.presentToast('Te has inscrito al evento');
        });
      }
    }
    else if(this.event.type === EventPeekusType.PRIVATE){
      if(this.accessCode===this.eventCode){
        this.modal.dismiss();
        const participantToPost = {idEvent: this.event.id, idParticipant: this.userId};
        this.eventService.saveParticipant(participantToPost).pipe().subscribe(p=>{
          this.event.participants++;
          this.event.userParticipates = true;
          this.presentToast('Te has inscrito al evento');
        });
      } else{
        this.presentToast('Código incorrecto');
      }
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
