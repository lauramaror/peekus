import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { presentAlert } from 'src/app/helpers/common-functions';
import { UserService } from 'src/app/services/user.service';
import { mergeMap } from 'rxjs/operators';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-item-friend',
  templateUrl: './item-friend.component.html',
  styleUrls: ['./item-friend.component.scss'],
})
export class ItemFriendComponent implements OnInit {
  @Input() usersList: any[];
  @Input() type: number;
  @Input() userId: string;

  @Output() updateUsers = new EventEmitter<any[]>();

  loading: boolean;

  constructor(
    private userService: UserService,
    private alertController: AlertController,
    private notificationService: NotificationService,
    private toastController: ToastController,

  ) { }

  ngOnInit() {}

  async acceptOrAdd(friendId: string){
    if(this.loading){
      return;
    }
    const alertText = this.type===1 ? '¿Quieres aceptar como amigo?' : '¿Quieres añadir como amigo?';
    const answer1 = await presentAlert(alertText, this.alertController);
    if(answer1==='confirm'){
      this.loading = true;
      if(this.type===1){
        const friendToPost = {idReceptor: this.userId, idSolicitant: friendId, status: 'ACCEPTED'};
        this.userService.updateFriend(friendToPost).pipe().subscribe(p=>{
          this.usersList = [];
          this.updateUsers.emit(this.usersList);
          this.presentToast('Solicitud de amistad aceptada');
          this.loading = false;
        });
      }
      else if(this.type===2){
        const friendToPost = {idReceptor: friendId, idSolicitant: this.userId};
        this.userService.saveFriend(friendToPost).pipe(mergeMap(p=>{
          const indexRemoved = this.usersList.findIndex(u=>u.id===friendId);
          this.usersList.splice(indexRemoved, 1);
          const bodyToPost = {idNotification: 'd4c36328-1ca5-4610-90a5-6b25468538f8', idUsers: [friendId] };
          return this.notificationService.saveNotificationUsers(bodyToPost);
        })).subscribe(part=>{
          this.updateUsers.emit(this.usersList);
          this.presentToast('Solicitud de amistad enviada');
          this.loading = false;
        });
      }
    }
  }

  async cancelOrRemove(friendId: string){
    if(this.loading){
      return;
    }
    const alertText = this.type===1 ? '¿Quieres rechazar la solicitud?' : '¿Quieres quitar de tus amigos?';
    const answer1 = await presentAlert(alertText, this.alertController);
    if(answer1==='confirm'){
      this.loading = true;
      if(this.type===1){
        const friendToPost = {idReceptor: this.userId, idSolicitant: friendId, status: 'REJECTED'};
        this.userService.updateFriend(friendToPost).pipe().subscribe(p=>{
          this.usersList = [];
          this.updateUsers.emit(this.usersList);
          this.presentToast('Solicitud de amistad rechazada');
          this.loading = false;
        });
      }
      else if(this.type===3){
        const friendToPost = '?idReceptor='+this.userId+'&idSolicitant='+friendId;
        this.userService.deleteFriend(friendToPost).pipe().subscribe(p=>{
          const indexRemoved = this.usersList.findIndex(u=>u.id===friendId);
          this.usersList.splice(indexRemoved, 1);
          this.updateUsers.emit(this.usersList);
          this.presentToast('Ya no sois amigos');
          this.loading = false;
        });
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
