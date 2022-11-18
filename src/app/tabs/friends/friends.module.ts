import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FriendsPage } from './friends.page';

import { FriendsPageRoutingModule } from './friends-routing.module';
import { CommonsModule } from 'src/app/commons/commons.module';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    CommonsModule,
    FriendsPageRoutingModule, ComponentsModule
  ],
  declarations: [FriendsPage]
})
export class FriendsPageModule {}
