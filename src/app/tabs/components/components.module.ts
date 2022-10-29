import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventListComponent } from './event-list/event-list.component';
import { EventCardComponent } from './event-card/event-card.component';
import { RouterModule } from '@angular/router';
import { CommonsModule } from '../../commons/commons.module';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule,
    CommonsModule
  ],
  declarations: [
    EventListComponent,
    EventCardComponent,
  ],
  exports: [
    EventListComponent,
  ]
})
export class ComponentsModule {}
