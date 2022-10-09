import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-my-events',
  templateUrl: 'my-events.page.html',
  styleUrls: ['my-events.page.scss']
})
export class MyEventsPage implements OnInit {

  userList: User[] = [];

  constructor(
    private userService: UserService
  ) {}

  ngOnInit(): void{
    this.getUserList();
  }

  getUserList(){
    this.userService.getUsers().subscribe(u=>{
      this.userList = u as User[];
    });
  }

}
