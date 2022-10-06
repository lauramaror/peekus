import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PeekusHeaderComponent } from './peekus-header/peekus-header.component';


@NgModule({
  declarations: [PeekusHeaderComponent],
  imports: [
    CommonModule
  ],
  exports: [
    PeekusHeaderComponent
  ]
})
export class CommonsModule { }
