import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BasePageRoutingModule } from './base-routing.module';

import { BasePage } from './base.page';
import { CommonsModule } from '../commons/commons.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BasePageRoutingModule,
    CommonsModule,
  ],
  declarations: [BasePage]
})
export class BasePageModule {}
