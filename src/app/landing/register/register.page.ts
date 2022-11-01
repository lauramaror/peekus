import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UserService } from '../../services/user.service';
import { ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  loading = false;
  registerForm: FormGroup;

  constructor(
    private userService: UserService,
    private toastController: ToastController,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {
    this.registerForm = this.formBuilder.group({
      name: [''],
      username: ['',Validators.required],
      email: [''],
      phone: [''],
      password: ['',Validators.required],
    });
  }

  ngOnInit() {
  }

  register(){
    if(!this.registerForm.valid){
      this.presentToast('Rellena el nombre de usuario y la contraseña');
      return;
    }
    if(!this.registerForm.get('email').value && !this.registerForm.get('phone').value){
      this.presentToast('Rellena el email y/o el teléfono');
      return;
    }
    this.loading = true;
    const userToRegister = new User(null, this.registerForm.get('username').value, this.registerForm.get('password').value,
                                    true, this.registerForm.get('name').value, this.registerForm.get('email').value,
                                    this.registerForm.get('phone').value);
    this.userService.saveUser(userToRegister).subscribe(e=>{
      this.loading = false;
      this.router.navigateByUrl('/landing/register/profilepic');
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
