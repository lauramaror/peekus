import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PeekusHeaderComponent } from './peekus-header/peekus-header.component';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [PeekusHeaderComponent],
  imports: [
    IonicModule,
    CommonModule
  ],
  exports: [
    PeekusHeaderComponent
  ]
})
export class CommonsModule { }
