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

@Component({
  selector: 'app-peekus-header',
  templateUrl: './peekus-header.component.html',
  styleUrls: ['./peekus-header.component.scss'],
})
export class PeekusHeaderComponent implements OnInit {

  userId = '';
  userProfilePicSrc = '';
  noLogoDefault = '../../../assets/img/nologo.png';

  constructor(
    private userService: UserService,
    private router: Router,
    private storageService: StorageService,
    private imageService: ImageService
  ) {
    this.storageService.getUserInfo().pipe(mergeMap(u=>{
      this.userId=u.id;
      return this.imageService.getImages('?id='+u.profilePic);
    })).subscribe(p=>{
      if((p as any[]).length){
        this.userProfilePicSrc = convertArrayBufferToBase64(p[0]['data']['data']);
      }
    });
   }

  ngOnInit() {
  }

  async logout(){
    await this.userService.logout();
    this.router.navigateByUrl('/landing');
  }

}
