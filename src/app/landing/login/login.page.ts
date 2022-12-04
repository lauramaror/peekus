/* eslint-disable @typescript-eslint/dot-notation */
import { Component, OnInit } from '@angular/core';
import { Login } from 'src/app/models/login.model';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loading = false;
  loginForm: FormGroup;

  constructor(
    private userService: UserService,
    private router: Router,
    private toastController: ToastController,
    private formBuilder: FormBuilder
  ) {
    this.loginForm = this.formBuilder.group({
      userData: ['',Validators.required],
      password: ['',Validators.required],
    });
  }

  ngOnInit() {
  }

  login(){
    if(!this.loginForm.valid){
      this.presentToast();
      return;
    }
    this.loading = true;
    this.userService.login(this.loginForm.value).subscribe(e=>{
      this.loading = false;
      if(e['ok']===false){
        this.presentToast();
        return;
      }
        this.router.navigateByUrl('/pk/tabs');
    });

  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Usuario o contraseña erróneas',
      duration: 1500,
      position: 'bottom',
      cssClass: 'my-custom-toast'
    });

    await toast.present();
  }

}
