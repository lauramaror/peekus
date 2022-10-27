import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchEventsPage } from './search-events.page';

import { SearchEventsPageRoutingModule } from './search-events-routing.module';
import { CommonsModule } from 'src/app/commons/commons.module';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    CommonsModule,
    SearchEventsPageRoutingModule,
    ComponentsModule
  ],
  declarations: [SearchEventsPage]
})
export class SearchEventsPageModule {}
