/* eslint-disable @typescript-eslint/dot-notation */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { of, zip } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { User } from 'src/app/models/user.model';
import { ImageService } from 'src/app/services/image.service';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  userId: string;
  loading = true;
  user: User;
  registerForm: FormGroup;
  photo: any;
  savingUser = false;

  constructor(
    private storageService: StorageService,
    private userService: UserService,
    private toastController: ToastController,
    private formBuilder: FormBuilder,
    private router: Router,
    private imageService: ImageService,
    private navController: NavController,
  ) {
    this.registerForm = this.formBuilder.group({
      name: [''],
      username: ['',Validators.required],
      email: [''],
      phone: [''],
    });
  }

  ngOnInit() {
    this.getUser();
  }

  getUser(){
    this.storageService.getUserInfo().pipe(mergeMap(userInfo=>{
      this.userId = userInfo.id;
      return this.userService.getUsers('?id='+this.userId);
    })).subscribe((user)=>{
      this.user = user[0] as User;
      this.registerForm.setValue({name: this.user.name, username: this.user.username,
        email: this.user.email, phone: this.user.phone});
      this.loading = false;
    });
  }

  saveChanges(){
    if(!this.registerForm.valid){
      this.presentToast('Rellena el nombre de usuario');
      return;
    }
    this.savingUser = true;
    this.photo = this.imageService.images[0];
    this.user.name = this.registerForm.get('name').value;
    this.user.username = this.registerForm.get('username').value;
    this.user.email = this.registerForm.get('email').value;
    this.user.phone = this.registerForm.get('phone').value;
    zip(
      this.userService.updateUser(this.user,'?id='+this.user.id),
      this.photo ?
      (this.user.idProfilePicture ? this.imageService.updatPictureUpload(this.photo, '?id='+this.user.idProfilePicture)
                                  : this.imageService.startUpload(this.photo, '?type=profile&idUser='+this.userId).pipe(mergeMap(photo=>{
                                    const bodyToSend = {idUser: this.userId, idProfilePicture: photo['imgId']};
                                    return this.userService.updateProfilePic(bodyToSend);
                                  })))
      : of(null)
    ).subscribe(([user, img])=>{
      this.savingUser = false;
      this.navController.navigateRoot(['/base/my-profile', this.userId]);
    });
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
