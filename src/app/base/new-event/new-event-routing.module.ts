import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';

import { NewEventPage } from './new-event.page';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: ':id', component: NewEventPage, canActivate: [AuthGuard]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewEventPageRoutingModule {}
