import { Component, Input, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { presentAlert } from 'src/app/helpers/common-functions';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-item-friend',
  templateUrl: './item-friend.component.html',
  styleUrls: ['./item-friend.component.scss'],
})
export class ItemFriendComponent implements OnInit {
  @Input() usersList: any[];
  @Input() type: number;
  @Input() userId: string;

  loading: boolean;

  constructor(
    private userService: UserService,
    private alertController: AlertController,
  ) { }

  ngOnInit() {}

  async acceptOrAdd(friendId: string){
    const alertText = this.type===1 ? '¿Quieres aceptar como amigo?' : '¿Quieres añadir como amigo?';
    const answer1 = await presentAlert(alertText, this.alertController);
    if(answer1==='confirm'){
      this.loading = true;
      if(this.type===1){
        const friendToPost = {idReceptor: this.userId, idSolicitant: friendId, status: 'ACCEPTED'};
        this.userService.updateFriend(friendToPost).pipe().subscribe(p=>{
          this.usersList = [];
          this.loading = false;
        });
      }
      else if(this.type===2){
        const friendToPost = {idReceptor: friendId, idSolicitant: this.userId};
        this.userService.saveFriend(friendToPost).pipe().subscribe(p=>{
          const indexRemoved = this.usersList.findIndex(u=>u.id===friendId);
          this.usersList.splice(indexRemoved, 1);
          this.loading = false;
        });
      }
    }
  }

  async cancelOrRemove(friendId: string){
    const alertText = this.type===1 ? '¿Quieres rechazar la solicitud?' : '¿Quieres quitar de tus amigos?';
    const answer1 = await presentAlert(alertText, this.alertController);
    if(answer1==='confirm'){
      this.loading = true;
      if(this.type===1){
        const friendToPost = {idReceptor: this.userId, idSolicitant: friendId, status: 'REJECTED'};
        this.userService.updateFriend(friendToPost).pipe().subscribe(p=>{
          this.usersList = [];
          this.loading = false;
        });
      }
      else if(this.type===3){
        const friendToPost = '?idReceptor='+this.userId+'&idSolicitant='+friendId;
        this.userService.deleteFriend(friendToPost).pipe().subscribe(p=>{
          const indexRemoved = this.usersList.findIndex(u=>u.id===friendId);
          this.usersList.splice(indexRemoved, 1);
          this.loading = false;
        });
      }
    }
  }
}
