import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BasePage } from './base.page';

const routes: Routes = [
  {
    path: '',
    // component: BasePage,
    children: [
      {
        path: 'detail',
        loadChildren: () => import('./event-detail/event-detail.module').then(m => m.EventDetailPageModule)
      },
      {
        path: 'edit',
        loadChildren: () => import('./new-event/new-event.module').then(m => m.NewEventPageModule)
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BasePageRoutingModule {}
