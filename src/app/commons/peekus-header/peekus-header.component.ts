/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable arrow-body-style */
import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { StorageService } from '../../services/storage.service';
import { map, mergeMap } from 'rxjs/operators';
import { ImageService } from '../../services/image.service';
import { from, Subscription, timer } from 'rxjs';
import { convertArrayBufferToBase64 } from 'src/app/helpers/common-functions';
import { NavController } from '@ionic/angular';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-peekus-header',
  templateUrl: './peekus-header.component.html',
  styleUrls: ['./peekus-header.component.scss'],
})
export class PeekusHeaderComponent implements OnInit, OnDestroy {

  userId = '';
  userProfilePicSrc = '';
  loadedPic = false;
  newNotifications = false;
  timerSubscription: Subscription;

  constructor(
    private userService: UserService,
    private router: Router,
    private storageService: StorageService,
    private imageService: ImageService,
    private navController: NavController,
    private notificationService: NotificationService,

  ) {
    this.storageService.getUserInfo().pipe(mergeMap(u=>{
      this.userId=u.id;
      this.userProfilePicSrc = u.idProfilePicture;
      this.loadedPic = true;
      return this.notificationService.getNotificationUsers('?idUser='+this.userId+'&notified=0');
    })).subscribe(s=>{
      this.newNotifications = (s as []).length > 0;
    });
   }

  ngOnInit() {
    this.timerSubscription = timer(0, 1000).pipe(
      map(() => {
        this.notificationService.getNotificationUsers('?idUser='+this.userId+'&notified=0').pipe().subscribe(n=>{
          this.newNotifications = (n as []).length > 0;
        });
      })
    ).subscribe();
  }

  ngOnDestroy(){
    this.timerSubscription.unsubscribe();
  }

  async logout(){
    await this.userService.logout();
    this.navController.navigateRoot(['/landing']);
  }

}
