import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterProfilepicComponent } from './register-profilepic/register-profilepic.component';

import { RegisterPage } from './register.page';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: RegisterPage
      },
      {
        path: 'profilepic',
        component: RegisterProfilepicComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterPageRoutingModule {}
