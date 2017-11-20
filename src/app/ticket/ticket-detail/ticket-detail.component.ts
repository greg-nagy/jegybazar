import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { EventModel } from '../../shared/event-model';
import { EventService } from '../../event/event.service';
import { TicketModel } from '../../shared/ticket-model';
import { TicketService } from '../../shared/ticket.service';
import { UserService } from '../../shared/user.service';

@Component({
  selector: 'app-ticket-detail',
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.css']
})
export class TicketDetailComponent implements OnInit, OnDestroy {
  ticket: TicketModel;
  events$: Observable<EventModel[]>;

  private _subs: Subscription;

  constructor(
    private _ticketService: TicketService,
    private _eventService: EventService,
    private _userService: UserService,
    private _router: Router
  ) {
  }

  ngOnInit() {
    this.ticket = new TicketModel();

    // ez egy kerulo megoldas, hogy tudjak select-nek default uzenetet kijelezeni
    // nem igazan szep, de tobbet most nem ert nekem a kerdes
    this.ticket.eventId = '';

    this._userService.getCurrentUser().subscribe(
      user => this.ticket.sellerUserId = user.id
    );
    this.events$ = this._eventService.getAllEvents();
  }

  ngOnDestroy() {
    if (this._subs != null && !this._subs.closed) {
      this._subs.unsubscribe();
    }
  }

  onSubmit() {
    console.log(this.ticket);
    this._subs = this._ticketService.create(this.ticket)
      .subscribe(newTicketId => this._router.navigate(['/ticket']));
  }
}
