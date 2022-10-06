import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchEventsPage } from './search-events.page';

const routes: Routes = [
  {
    path: '',
    component: SearchEventsPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchEventsPageRoutingModule {}
