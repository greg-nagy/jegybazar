import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TicketModel } from '../../shared/ticket-model';
import { TicketService } from '../../shared/ticket.service';
import { UserService } from '../../shared/user.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import { Subscription } from 'rxjs/Subscription';
import { fromEvent } from 'rxjs/observable/fromEvent';

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.css']
})
export class TicketListComponent implements OnInit, OnDestroy, AfterViewInit {
  tickets: TicketModel[];
  isLoggedIn: boolean;
  @ViewChild('searchInput') searchInput: ElementRef;
  private filteredText$ = new BehaviorSubject<string>(null);
  private ticketsSubscription: Subscription;
  private isLoggedInSubcription: Subscription;

  constructor(
    private _ticketService: TicketService,
    private cdr: ChangeDetectorRef,
    userService: UserService
  ) {
    this.isLoggedInSubcription = userService.isLoggedIn$.subscribe(
      isLoggedIn => this.isLoggedIn = isLoggedIn
    );
  }

  ngOnDestroy(): void {
    this.ticketsSubscription.unsubscribe();
    this.isLoggedInSubcription.unsubscribe();
  }

  ngAfterViewInit(): void {
    fromEvent(this.searchInput.nativeElement, 'keyup')
      .map(
        (event: Event) => (event.srcElement as HTMLInputElement).value
      )
      .distinctUntilChanged()
      .subscribe(
        text => {
          if (text.length === 0) {
            text = null;
          }
          this.filteredText$.next(text);
        }
      );

    this.cdr.detach();
  }

  ngOnInit() {
    this.ticketsSubscription = this._ticketService.getAllTickets()
      .flatMap(
        tickets => {
          return this.filteredText$.map(
            filterText => {
              if (filterText === null) {
                return tickets;
              } else {
                return tickets.filter(
                  ticket => {
                    return ticket.event.name.toLowerCase().indexOf(filterText.toLowerCase()) > -1;
                  }
                );
              }
            }
          );
        }
      )
      .subscribe(
        tickets => {
          this.tickets = tickets;
          this.cdr.detectChanges();
        }
      );
  }
}
