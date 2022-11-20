/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable arrow-body-style */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { zip } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { convertArrayBufferToBase64 } from 'src/app/helpers/common-functions';
import { User } from 'src/app/models/user.model';
import { EventService } from 'src/app/services/event.service';
import { ImageService } from 'src/app/services/image.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from '../../services/user.service';
import { PreviousRouteService } from '../../services/previous-route.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.page.html',
  styleUrls: ['./my-profile.page.scss'],
})
export class MyProfilePage implements OnInit {
  user: User;
  loggedUserId: string;
  profileUserId: string;
  loading = true;
  isFriend = false;
  participatedTab = true;
  isMyself = false;
  collagesParticipated = [];
  collagesLiked = [];
  previousUrl = '';

  constructor(
    private route: ActivatedRoute,
    private storageService: StorageService,
    private userService: UserService,
    private eventService: EventService,
    private imageService: ImageService,
    private navController: NavController,
    private previousRouteService: PreviousRouteService
  ) { }

  ngOnInit() {
    this.previousUrl = !this.previousRouteService.getLoop() && this.previousRouteService.getPreviousUrl()
                    ? this.previousRouteService.getPreviousUrl() : '/tabs/my-events';
    this.profileUserId = this.route.snapshot.params.id;
    this.getUser();
  }

  getUser(){
    this.storageService.getUserInfo().pipe(map(userInfo=>{
      this.loggedUserId = userInfo.id;
      this.isMyself = this.loggedUserId === this.profileUserId;
      return '?id='+this.profileUserId;
    }), mergeMap(params=> {
      return zip(
        this.userService.getUsers(params),
        this.userService.getFriends('?id='+this.loggedUserId),
        this.imageService.getImages('?idUserParticipant='+this.profileUserId),
        this.imageService.getImages('?idUserLiked='+this.profileUserId)
      );
    })).subscribe(([user, friends, collageParticipated, collageLiked])=>{
      this.user = user[0] as User;
      this.isFriend = (friends as []).filter(u=>u['status']==='ACCEPTED').flatMap(u=>u['friendData'])
                      .find(f=>f['id'] === this.profileUserId);
      this.collagesParticipated = (collageParticipated as []).map(c=> {
        return {
          id: c['idEvent'],
          collage: convertArrayBufferToBase64(c['data']['data'])
        };
      });
      this.collagesLiked = (collageLiked as []).map(c=> {
        return {
          id: c['idEvent'],
          collage: convertArrayBufferToBase64(c['data']['data'])
        };
      });
      this.loading = false;
    });
  }

  changeTab(fromTab: number){
    this.participatedTab = fromTab===1;
    // if(this.myFriends){
    //   this.getUsers();
    // } else{
    //   this.getFriendRequests();
    // }
  }

  async logout(){
    await this.userService.logout();
    this.navController.navigateRoot(['/landing']);
  }

}
