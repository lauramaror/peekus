import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';

import { EventDetailPage } from './event-detail.page';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: ':id', component: EventDetailPage, canActivate: [AuthGuard]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventDetailPageRoutingModule {}
