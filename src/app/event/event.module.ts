import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventRoutingModule } from './event-routing.module';
import { EventComponent } from './event.component';
import { EventListComponent } from './event-list/event-list.component';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { FormsModule } from '@angular/forms';
import { AlertModule } from 'ngx-bootstrap';
import { EventcardModule } from './eventcard/eventcard.module';
import { CoreModule } from '../core/core.module';
import { EventService } from './event.service';

@NgModule({
  imports: [
    CommonModule,
    EventRoutingModule,
    FormsModule,

    AlertModule,
    EventcardModule,
    CoreModule
  ],
  declarations: [
    EventComponent,
    EventListComponent,
    EventDetailComponent
  ]
})
export class EventModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: EventModule,
      providers: [EventService]
    };
  }
}
