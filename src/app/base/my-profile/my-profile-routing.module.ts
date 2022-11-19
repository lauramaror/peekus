import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';

import { MyProfilePage } from './my-profile.page';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: ':id', component: MyProfilePage, canActivate: [AuthGuard]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyProfilePageRoutingModule {}
