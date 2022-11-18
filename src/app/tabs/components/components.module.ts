import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventListComponent } from './event-list/event-list.component';
import { EventCardComponent } from './event-card/event-card.component';
import { RouterModule } from '@angular/router';
import { CommonsModule } from '../../commons/commons.module';
import { ItemFriendComponent } from './item-friend/item-friend.component';


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
    ItemFriendComponent
  ],
  exports: [
    EventListComponent,
    ItemFriendComponent
  ]
})
export class ComponentsModule {}
