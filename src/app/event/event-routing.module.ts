import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventComponent } from './event.component';
import { EventListComponent } from './event-list/event-list.component';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { LoggedInGuardGuard } from '../shared/logged-in-guard.guard';

const routes: Routes = [
  {
    path: '',
    component: EventComponent,
    children: [
      { path: '', component: EventListComponent },
      { path: 'new', component: EventDetailComponent, canActivate: [LoggedInGuardGuard] },
      { path: ':id', component: EventDetailComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventRoutingModule {}
