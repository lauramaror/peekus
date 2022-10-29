import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PeekusHeaderComponent } from './peekus-header/peekus-header.component';
import { IonicModule } from '@ionic/angular';
import { PeekusBackButtonComponent } from './peekus-back-button/peekus-back-button.component';


@NgModule({
  declarations: [
    PeekusHeaderComponent,
    PeekusBackButtonComponent
  ],
  imports: [
    IonicModule,
    CommonModule
  ],
  exports: [
    PeekusHeaderComponent,
    PeekusBackButtonComponent
  ]
})
export class CommonsModule { }
