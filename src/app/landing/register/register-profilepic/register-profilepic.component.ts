/* eslint-disable @typescript-eslint/dot-notation */
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { mergeMap } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import { ImageService } from '../../../services/image.service';
import { StorageService } from '../../../services/storage.service';

@Component({
  selector: 'app-register-profilepic',
  templateUrl: './register-profilepic.component.html',
  styleUrls: ['./register-profilepic.component.scss'],
})
export class RegisterProfilepicComponent implements OnInit {

  photoDefault = '../../../assets/img/nologo.png';
  photo: any;
  userId = '';
  savingPhoto = false;

  constructor(
    private imageService: ImageService,
    private userService: UserService,
    private storageService: StorageService,
    private navController: NavController,
    ) { }

  ngOnInit() {
    this.storageService.getUserInfo().pipe().subscribe(u=>this.userId=u.id);
    this.deleteAllFiles();
  }

  async deleteAllFiles(){
    await this.imageService.loadFiles();
    await this.imageService.deleteImages();
  }

  async selectImage(){
    await this.imageService.selectImage();
    this.photo = this.imageService.images[0];
  }

  postImage(){
    this.savingPhoto = true;
    const params = '?type=profile&idUser='+this.userId;
    this.imageService.startUpload(this.photo, params).pipe(mergeMap(photo=>{
      const idPhoto = photo['imgId'];
      const bodyToSend = {idUser: this.userId, idProfilePicture: idPhoto};
      return this.userService.updateProfilePic(bodyToSend);
    })).subscribe(i=>{
      this.savingPhoto = false;
      this.navController.navigateRoot(['/tabs/my-events']);
    });
  }

}
