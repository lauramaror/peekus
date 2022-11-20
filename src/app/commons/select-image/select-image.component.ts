/* eslint-disable @typescript-eslint/dot-notation */
import { Component, Input, OnInit } from '@angular/core';
import { convertArrayBufferToBase64 } from 'src/app/helpers/common-functions';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-select-image',
  templateUrl: './select-image.component.html',
  styleUrls: ['./select-image.component.scss'],
})
export class SelectImageComponent implements OnInit {
  @Input() size: number;
  @Input() profilePictureId: string;

  photoDefault = '../../../assets/img/nologo.png';
  userProfilePicSrc = '';
  photo: any;

  constructor(
    private imageService: ImageService,
  ) { }

  ngOnInit() {
    this.deleteAllFiles();
    this.imageService.getImages('?id='+this.profilePictureId).pipe().subscribe(p=>{
      this.userProfilePicSrc = (p as any[]).length ? convertArrayBufferToBase64(p[0]['data']['data']) : this.photoDefault;
    });
  }

  async deleteAllFiles(){
    await this.imageService.loadFiles();
    await this.imageService.deleteImages();
  }

  async selectImage(){
    await this.imageService.selectImage();
    this.photo = this.imageService.images[0];
  }

}
