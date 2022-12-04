import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { PreviousRouteService } from 'src/app/services/previous-route.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  previousUrl = '';

  constructor(
    private userService: UserService,
    private navController: NavController,
    private previousRouteService: PreviousRouteService

  ) { }

  ngOnInit() {
    this.previousUrl = !this.previousRouteService.getLoop() && this.previousRouteService.getPreviousUrl()
    ? this.previousRouteService.getPreviousUrl() : '/pk/tabs/my-events';
  }

  async logout(){
    await this.userService.logout();
    this.navController.navigateRoot(['/landing']);
  }

}
