import { Component, OnInit } from '@angular/core';
import { Login } from 'src/app/models/login.model';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  userDataForm: string;
  passwordForm: string;
  loggedIn = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private toastController: ToastController
  ) { }

  ngOnInit() {
  }

  login(){
    if(!this.userDataForm || !this.passwordForm){
      this.presentToast();
      return;
    }
    const userToLogin = new Login(this.userDataForm, this.passwordForm);
    this.userService.login(userToLogin).subscribe(e=>{
      this.loggedIn = true;
      this.router.navigateByUrl('/tabs');
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
