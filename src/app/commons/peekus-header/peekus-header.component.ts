import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-peekus-header',
  templateUrl: './peekus-header.component.html',
  styleUrls: ['./peekus-header.component.scss'],
})
export class PeekusHeaderComponent implements OnInit {

  constructor(
    private userService: UserService,
    private router: Router,
  ) { }

  ngOnInit() {}

  async logout(){
    await this.userService.logout();
    this.router.navigateByUrl('/landing');
  }

}
