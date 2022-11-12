import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PeekusHeaderComponent } from './peekus-header/peekus-header.component';
import { IonicModule } from '@ionic/angular';
import { PeekusBackButtonComponent } from './peekus-back-button/peekus-back-button.component';
import { EventStatusBadgeComponent } from './event-status-badge/event-status-badge.component';
import { RouterModule } from '@angular/router';
import { ProfilePictureComponent } from './profile-picture/profile-picture.component';


@NgModule({
  declarations: [
    PeekusHeaderComponent,
    PeekusBackButtonComponent,
    EventStatusBadgeComponent,
    ProfilePictureComponent
  ],
  imports: [
    IonicModule,
    CommonModule,
    RouterModule
  ],
  exports: [
    PeekusHeaderComponent,
    PeekusBackButtonComponent,
    EventStatusBadgeComponent,
    ProfilePictureComponent
  ]
})
export class CommonsModule { }
