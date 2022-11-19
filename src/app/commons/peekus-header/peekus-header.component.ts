/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable arrow-body-style */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { StorageService } from '../../services/storage.service';
import { mergeMap } from 'rxjs/operators';
import { ImageService } from '../../services/image.service';
import { from } from 'rxjs';
import { convertArrayBufferToBase64 } from 'src/app/helpers/common-functions';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-peekus-header',
  templateUrl: './peekus-header.component.html',
  styleUrls: ['./peekus-header.component.scss'],
})
export class PeekusHeaderComponent implements OnInit {

  userId = '';
  userProfilePicSrc = '';
  loadedPic = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private storageService: StorageService,
    private imageService: ImageService,
    private navController: NavController,

  ) {
    this.storageService.getUserInfo().pipe().subscribe(u=>{
      this.userId=u.id;
      this.userProfilePicSrc = u.idProfilePicture;
      this.loadedPic = true;
    });
   }

  ngOnInit() {
  }

  async logout(){
    await this.userService.logout();
    this.navController.navigateRoot(['/landing']);
  }

}
