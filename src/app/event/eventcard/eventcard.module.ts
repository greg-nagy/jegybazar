import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventcardComponent } from './eventcard.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [
    EventcardComponent
  ],
  exports: [
    EventcardComponent
  ]
})
export class EventcardModule {}
