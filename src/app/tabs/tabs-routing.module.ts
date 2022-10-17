import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'my-events',
        loadChildren: () => import('./my-events/my-events.module').then(m => m.MyEventsPageModule)
      },
      {
        path: 'search-events',
        loadChildren: () => import('./search-events/search-events.module').then(m => m.SearchEventsPageModule)
      },
      {
        path: 'friends',
        loadChildren: () => import('./friends/friends.module').then(m => m.FriendsPageModule)
      },
      {
        path: '',
        redirectTo: 'my-events',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
