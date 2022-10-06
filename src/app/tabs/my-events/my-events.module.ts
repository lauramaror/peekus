import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MyEventsPage } from './my-events.page';

import { MyEventsPageRoutingModule } from './my-events-routing.module';
import { CommonsModule } from '../../commons/commons.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    MyEventsPageRoutingModule,
    CommonsModule
  ],
  declarations: [MyEventsPage]
})
export class MyEventsPageModule {}
