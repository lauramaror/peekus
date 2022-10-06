import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyEventsPage } from './my-events.page';

const routes: Routes = [
  {
    path: '',
    component: MyEventsPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyEventsPageRoutingModule {}
