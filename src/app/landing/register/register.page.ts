import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  nameForm: string;
  usernameForm: string;
  emailForm: string;
  phoneForm: number;
  passwordForm: string;
  registered = false;

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
  }

  register(){
    const userToRegister = new User(null, this.usernameForm, this.passwordForm, true, this.nameForm, this.emailForm, this.phoneForm);
    this.userService.saveUser(userToRegister).subscribe(e=>{
      this.registered = true;
    });
  }

}
