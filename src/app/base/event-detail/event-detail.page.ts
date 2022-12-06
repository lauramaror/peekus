/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable arrow-body-style */
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of, zip } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { convertArrayBufferToBase64, presentAlert } from 'src/app/helpers/common-functions';
import { optionsByTypeMap, optionsByStatusMap } from 'src/app/helpers/options-maps';
import { CommentPeekus } from 'src/app/models/comment.model';
import { EventPeekus } from 'src/app/models/event.model';
import { EventService } from 'src/app/services/event.service';
import { StorageService } from 'src/app/services/storage.service';
import { AlertController, IonModal, ToastController } from '@ionic/angular';
import { ImageService } from '../../services/image.service';
import { EventPeekusStatus, EventPeekusType } from 'src/app/helpers/enums';
import { PreviousRouteService } from 'src/app/services/previous-route.service';
import { UserService } from 'src/app/services/user.service';
import { NotificationService } from 'src/app/services/notification.service';
import { LocalNotifications } from '@capacitor/local-notifications';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.page.html',
  styleUrls: ['./event-detail.page.scss'],
})
export class EventDetailPage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;

  optionsByTypeMap = optionsByTypeMap;
  eventStatus = EventPeekusStatus;
  eventType = EventPeekusType;
  optionsByStatusMap = optionsByStatusMap;
  loading = true;
  eventId = '';
  eventData: EventPeekus;
  backButtonText = 'Eventos';
  userId = '';
  createdDate = '';
  startDayWeek = '';
  startDayMonth = '';
  eventParticipants = [];
  eventComments = [];
  commentToPost = '';
  loadingComments = false;
  loadingParticipants = false;
  participantActions = [{id: 0, buttonText: 'CANCELAR INSCRIPCIÓN'},{id: 1, buttonText: 'INSCRIBIRSE'}];
  currentAction = 0;
  likingProcess = false;
  generatingCollage = false;
  actionIcon = '';
  actionOption: number;
  photo: any;
  savingPhoto = false;
  collageSrc = [];
  previousUrl = '';
  usersList = [];
  participantsInvitedList = [];
  savingParticipants = false;
  notificationId = '';
  eventQR = '';

  constructor(
    private route: ActivatedRoute,
    private storageService: StorageService,
    private eventService: EventService,
    private datePipe: DatePipe,
    private alertController: AlertController,
    private router: Router,
    private imageService: ImageService,
    private previousRouteService: PreviousRouteService,
    private userService: UserService,
    private notificationService: NotificationService,
    private toastController: ToastController,

    ) { }

  ngOnInit() {
    this.previousUrl = !this.previousRouteService.getLoop() && this.previousRouteService.getPreviousUrl()
                      ? this.previousRouteService.getPreviousUrl() : '/pk/tabs/my-events';
    this.eventId = this.route.snapshot.params.id;
    this.getEvent();
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
        this.eventService.getCommentsByEvent('?idEvent='+this.eventId),
        this.imageService.getImages('?idEvent='+this.eventId+'&type=collage'),
        this.eventService.getCodes('?idEvent='+this.eventId+'&type=QR')
      );
    })).subscribe(([event, participants, comments, collage, codes])=>{
      this.eventData = event[0] as EventPeekus;
      this.eventData.likedByUser = event[0].likedByUser === 1;
      this.eventData.completedByUser = event[0].completedByUser === 1;
      this.eventParticipants = participants as [];
      this.eventComments = comments as [];
      const collages = (collage as any[]);
      if(collages.length){
        collages.forEach(c=>{
          const collageData = convertArrayBufferToBase64(c['data']['data']);
          this.collageSrc.push(collageData);
        });
      }
      const allCodes = (codes as any[]);
      if(allCodes.length){
        this.eventQR = convertArrayBufferToBase64(allCodes[0]['dataQR']['data']);
      }

      this.eventData.createdDate = new Date(this.eventData.createdDate);
      this.eventData.createdDate.setHours(this.eventData.createdDate.getHours()+1);
      this.eventData.startDate = new Date(this.eventData.startDate);
      this.eventData.startDate.setHours(this.eventData.startDate.getHours()+1);
      this.eventData.endDate = new Date(this.eventData.endDate);
      this.eventData.endDate.setHours(this.eventData.endDate.getHours()+1);

      const createdDateToFormat = new Date(this.eventData.createdDate);
      const createdMonth = new Intl.DateTimeFormat('es-ES', { month: 'short'}).format(createdDateToFormat);
      this.createdDate = createdDateToFormat.getDate() + ' '+createdMonth+'. ' + createdDateToFormat.getFullYear();
      const startDateToFormat = new Date(this.eventData.startDate+'Z');
      this.startDayMonth = new Intl.DateTimeFormat('es-ES', { month: 'short'}).format(startDateToFormat);
      this.startDayWeek = this.dayWeekName(startDateToFormat);

      this.setActionOption();
      this.buildComments();
      this.currentAction = this.eventParticipants.find(p=>p.idParticipant===this.userId) ? 0 : 1;

      this.loading = false;
    });
  }

  setActionOption(){
    const today = new Date();
    this.actionIcon = this.eventData.status === EventPeekusStatus.FINISHED && this.collageSrc.length ? 'download-outline' : '';
    if(this.eventData.creator === this.userId){
      if(this.eventData.status === EventPeekusStatus.FINISHED && this.collageSrc.length===0){
          this.actionOption = 1;
      }

      if((this.eventData.status === EventPeekusStatus.NEXT && new Date(this.eventData.startDate) < today)
        ||(this.eventData.status === EventPeekusStatus.ONGOING && new Date(this.eventData.endDate) <= today)){
          this.actionOption = 2;
      }
    }
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

  buildComments(){
    this.eventComments.forEach(c=>{
      const commentDate = new Date(c.commentDate);
      c['formattedDate'] = this.datePipe.transform(commentDate, 'HH:mm') + ' · ' + commentDate.getDate() + ' '
                          + new Intl.DateTimeFormat('es-ES', { month: 'short'}).format(commentDate) + '. '
                          + commentDate.getFullYear();
    });
    this.eventComments.sort((a,b) => new Date(a.commentDate).getTime() - new Date(b.commentDate).getTime());
  }

  postComment(){
    if(this.commentToPost.trim()){
      this.loadingComments = true;
      const newComment = new CommentPeekus(this.commentToPost, this.userId, this.eventId);
      this.eventService.postComment(newComment).pipe(
        mergeMap(c=>this.eventService.getCommentsByEvent('?idEvent='+this.eventId))).subscribe(comments=>{
          this.eventComments = comments as [];
          this.buildComments();
          this.commentToPost = '';
          this.loadingComments = false;
      });
    }
  }

  async inscriptionEvent(){
    switch(this.currentAction){
      case 0:
        const answer0 = await presentAlert('¿Quieres cancelar tu inscripción al evento?', this.alertController);
        if(answer0==='confirm'){
          this.loadingParticipants = true;
          const params = '?idEvent='+this.eventId+'&idParticipant='+this.userId;
          this.eventService.deleteParticipant(params).pipe(
            mergeMap(c=>this.eventService.getParticipantsByEvent('?idEvent='+this.eventId))).subscribe(participants=>{
              this.eventParticipants = participants as [];
              this.eventData.participants--;
              this.eventData.userParticipates = false;
              this.currentAction = 1;
              this.loadingParticipants = false;
              this.presentToast('Has cancelado tu inscripción');
          });
        }
        break;
      case 1:
        const answer1 = await presentAlert('¿Quieres inscribirte al evento?', this.alertController);
        if(answer1==='confirm'){
          this.loadingParticipants = true;
          const participantToPost = {idEvent: this.eventId, idParticipant: this.userId};
          this.eventService.saveParticipant(participantToPost).pipe(
            mergeMap(c=>this.eventService.getParticipantsByEvent('?idEvent='+this.eventId))).subscribe(participants=>{
              this.eventParticipants = participants as [];
              this.eventData.participants++;
              this.eventData.userParticipates = true;
              this.currentAction = 0;
              LocalNotifications.schedule({
                notifications: [{
                  title: '¡Hora de hacer foto!',
                  body: 'El evento '+this.eventData.name+' acaba de comenzar',
                  id: Math.random(),
                  schedule: {at: new Date(this.eventData.startDate)}
                }]
              });
              this.loadingParticipants = false;
              this.presentToast('Te has inscrito al evento');
          });
        }
        break;
    }
  }

  likeEvent(){
    if(this.likingProcess){
      return;
    }
    this.likingProcess = true;
    if(this.eventData.likedByUser){
      this.eventData.likedByUser = false;
      this.eventData.likes--;
      const params = '?idEvent='+this.eventId+'&idUser='+this.userId;
      this.eventService.deleteLike(params).pipe().subscribe(l=>{
        this.likingProcess = false;
      });
    }
    else{
      this.eventData.likedByUser = true;
      this.eventData.likes++;
      const likeToPost = {idEvent: this.eventId, idUser: this.userId};
      this.eventService.saveLike(likeToPost).pipe().subscribe(l=>{
        this.likingProcess = false;
      });
    }
  }

  async deleteEvent(){
    const answer1 = await presentAlert('¿Quieres borrar el evento?', this.alertController);
    if(answer1==='confirm'){
      const params = '?id='+this.eventId;
      this.eventService.deleteEvent(params).pipe().subscribe(l=>{
        this.router.navigateByUrl('/pk/tabs/my-events');
      });
    }
  }

  async takePhoto(){
    await this.imageService.takePhoto();
    this.photo = this.imageService.images[0];
    if(this.photo){
      this.savingPhoto = true;
      this.eventData.completedByUser = true;
      const params = '?type=event&idUser='+this.userId+'&idEvent='+this.eventData.id;
      this.imageService.startUpload(this.photo, params).pipe(mergeMap(photo=>{
        const idPhoto = photo['imgId'];
        const bodyToSend = {idParticipant: this.userId, idEvent: this.eventData.id, idImage: idPhoto, completed: 1};
        return this.eventService.updateParticipant(bodyToSend);
      })).subscribe(i=>{
        this.savingPhoto = false;
      });
    }
  }

  generateCollage(){
    this.generatingCollage = true;
    this.actionOption = null;
    const params = '?idEvent='+this.eventId;
    this.imageService.generateCollage(params).pipe(mergeMap(c=>{
      return this.imageService.getImages('?idEvent='+this.eventId+'&type=collage');
    })).subscribe(collage=>{
      const collages = (collage as any[]);
      if(collages.length){
        collages.forEach(c=>{
          const collageData = convertArrayBufferToBase64(c['data']['data']);
          this.collageSrc.push(collageData);
        });
      }
      this.generatingCollage = false;
    });
  }

  updateEventStatus(statusToUpdate: EventPeekusStatus){
    this.actionOption = null;
    const params = '?id='+this.eventId;
    this.eventService.updateEventStatus({status: statusToUpdate},params).pipe().subscribe(l=>{
      this.eventData.status = statusToUpdate;
      this.setActionOption();
    });
  }

  performAction(action: string){
    switch (action){
      case 'download':
        this.imageService.saveCollagesToGallery(this.collageSrc).then((saved) => {
          const textToast = saved ? 'Collage guardado en galería' : 'Ha habido un error guardando el collage';
          this.presentToast(textToast);
        });
        break;
      case 'generate':
        this.generateCollage();
        break;
      case 'update':
        let status = null;
        if(this.eventData.status === EventPeekusStatus.NEXT){
            status = EventPeekusStatus.ONGOING;
        }
        if(this.eventData.status === EventPeekusStatus.ONGOING){
            status = EventPeekusStatus.FINISHED;
        }
        this.updateEventStatus(status);
        break;
    }
  }

  searchUser(event) {
    const query = event.target.value.toLowerCase();
    this.usersList = [];
    if(query!=='') { this.getUsers(query); }
  }

  getUsers(textToSearch?: string){
    this.userService.getUsers('?text='+textToSearch).subscribe(e=>{
      this.usersList = (e as []).filter(u=>!this.participantsInvitedList.flatMap(p=>p.id).includes(u['id']) && u['id']!==this.userId);
    });
  }

  loadInvites(){
    const params = '?idEvent='+this.eventId+'&type=EVENT_INVITE';
    const notifToPost = {idEvent: this.eventId, type: 'EVENT_INVITE', description: 'Te han invitado al evento '+this.eventData.name};
    this.notificationService.getNotifications(params).pipe(map(n=>{
      return n as any[];
    }), mergeMap(no=>{
      return no.length ? of(no[0]) : this.notificationService.saveNotification(notifToPost);
    }), mergeMap(nu=>{
      this.notificationId = nu.id;
      const paramsNu = '?idNotification='+nu.id;
      return this.notificationService.getNotificationUsers(paramsNu);
    })).subscribe(notif=>{
      this.participantsInvitedList = (notif as []).map(c=> {
          return {
            id: c['idUser'],
            username: c['username'],
            idProfilePicture: c['idProfilePicture'],
          };
        });
    });
  }

  saveParticipant(participant: any){
    this.participantsInvitedList.push({
      id: participant.id,
      username: participant.username,
      idProfilePicture: participant.idProfilePicture,
    });
    this.usersList = this.usersList.filter(u=>u.id!==participant.id);
  }

  sendNotifications(){
    this.savingParticipants = true;
    const bodyToPost = {idNotification: this.notificationId, idUsers: this.participantsInvitedList.flatMap(p=>p.id) };
    this.notificationService.saveNotificationUsers(bodyToPost).pipe().subscribe(notif=>{
      this.savingParticipants = false;
      this.modal.dismiss();
      this.presentToast('Invitaciones enviadas');
    });
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
