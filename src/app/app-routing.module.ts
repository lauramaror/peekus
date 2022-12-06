import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { FullHeaderComponent } from './commons/full-header/full-header.component';

const routes: Routes = [
  {
    path: 'landing',
    loadChildren: () => import('./landing/landing.module').then( m => m.LandingPageModule)
  },
  {
    path: 'pk',
    component: FullHeaderComponent,
    children: [
      {
        path: 'tabs',
        loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
      },
      {
        path: 'base',
        loadChildren: () => import('./base/base.module').then( m => m.BasePageModule)
      },
      {
        path: '',
        redirectTo: 'tabs',
        pathMatch: 'full'
      },
    ]
  },
  {
    path: '',
    redirectTo: 'pk',
    pathMatch: 'full'
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
