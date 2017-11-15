import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AboutRoutingModule } from './about-routing.module';
import { AboutComponent } from './about.component';
import { CoreModule } from '../core/core.module';

@NgModule({
  imports: [
    CommonModule,
    AboutRoutingModule,

    CoreModule
  ],
  declarations: [
    AboutComponent
  ]
})
export class AboutModule {}
