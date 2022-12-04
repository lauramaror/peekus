/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable arrow-body-style */
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { map, mergeMap } from 'rxjs/operators';
import { NotificationService } from 'src/app/services/notification.service';
import { PreviousRouteService } from 'src/app/services/previous-route.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {

  previousUrl = '';
  notificationsList = [];
  loading = true;
  userId = '';

  constructor(
    private previousRouteService: PreviousRouteService,
    private notificationService: NotificationService,
    private storageService: StorageService,
    private datePipe: DatePipe,
    private navController: NavController
  ) { }

  ngOnInit() {
    this.previousUrl = !this.previousRouteService.getLoop() && this.previousRouteService.getPreviousUrl()
    ? this.previousRouteService.getPreviousUrl() : '/pk/tabs/my-events';
    this.loadNotifications();
  }

  loadNotifications(){
    this.storageService.getUserInfo().pipe(map(userInfo=>{
      this.userId = userInfo.id;
      return '?idUser='+this.userId;
    }), mergeMap(params=>{
      return this.notificationService.getNotificationUsers(params);
    }
    )).subscribe(notif=>{
      this.notificationsList = (notif as []);
      this.notificationsList.forEach(c=>{
        const createdDate = new Date(c.createdDate);
        c['formattedDate'] = createdDate.getDate() + ' '
                            + new Intl.DateTimeFormat('es-ES', { month: 'short'}).format(createdDate) + '. '
                            + createdDate.getFullYear();
      });
      this.notificationsList.sort((a,b) => new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime());
      this.loading = false;
    });
  }

  notifiedCheck(notificationToCheck: any){
    this.notificationService.updateNotificationUser('?id='+notificationToCheck.id).pipe().subscribe(n=>{
      this.navController.navigateRoot([notificationToCheck.redirectLink]);
    });
  }

}
