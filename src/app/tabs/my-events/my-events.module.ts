import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MyEventsPage } from './my-events.page';

import { MyEventsPageRoutingModule } from './my-events-routing.module';
import { TabsPageModule } from '../tabs.module';

@NgModule({
  imports: [
    TabsPageModule
  ],
  declarations: [MyEventsPage]
})
export class MyEventsPageModule {}
