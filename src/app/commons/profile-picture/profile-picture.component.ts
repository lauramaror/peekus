/* eslint-disable @typescript-eslint/dot-notation */
import { Component, Input, OnInit } from '@angular/core';
import { convertArrayBufferToBase64 } from 'src/app/helpers/common-functions';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-profile-picture',
  templateUrl: './profile-picture.component.html',
  styleUrls: ['./profile-picture.component.scss'],
})
export class ProfilePictureComponent implements OnInit {

  @Input() profilePictureId: string;
  @Input() size: number;

  userProfilePicSrc = '';
  noLogoDefault = '../../../assets/img/nologo.png';

  constructor(
    private imageService: ImageService,
    ) {}

  ngOnInit() {
    this.imageService.getImages('?id='+this.profilePictureId).pipe().subscribe(p=>{
      if((p as any[]).length){
        this.userProfilePicSrc = convertArrayBufferToBase64(p[0]['data']['data']);
      }
    });
  }

}
