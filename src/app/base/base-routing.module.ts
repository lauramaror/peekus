import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FullContentComponent } from '../commons/full-content/full-content.component';
import { FullHeaderComponent } from '../commons/full-header/full-header.component';

import { BasePage } from './base.page';

const routes: Routes = [
  {
    path: '',
    component: FullContentComponent,
    children: [
      {
        path: 'detail',
        loadChildren: () => import('./event-detail/event-detail.module').then(m => m.EventDetailPageModule)
      },
      {
        path: 'edit',
        loadChildren: () => import('./new-event/new-event.module').then(m => m.NewEventPageModule)
      },
      {
        path: 'my-profile',
        loadChildren: () => import('./my-profile/my-profile.module').then( m => m.MyProfilePageModule)
      },
      {
        path: 'edit-profile',
        loadChildren: () => import('./edit-profile/edit-profile.module').then( m => m.EditProfilePageModule)
      },
      {
        path: 'notifications',
        loadChildren: () => import('./notifications/notifications.module').then( m => m.NotificationsPageModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule)
      },
    ]
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BasePageRoutingModule {}
