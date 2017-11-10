import { Component, OnDestroy, OnInit } from '@angular/core';
import { TicketService } from '../../shared/ticket.service';
import { TicketModel } from '../../shared/ticket-model';
import { UserService } from '../../shared/user.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/share';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-bid',
  templateUrl: './bid.component.html',
  styleUrls: ['./bid.component.css']
})
export class BidComponent implements OnInit, OnDestroy {
  ticket$: Observable<TicketModel>;
  isLoggedIn$: Observable<boolean>;
  progressRefreshTicket = false;
  private ticketWatcherSubscription: Subscription;

  constructor(
    private ticketService: TicketService,
    userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.isLoggedIn$ = userService.isLoggedIn$;
  }

  ngOnDestroy(): void {
    this.ticketWatcherSubscription.unsubscribe();
  }

  ngOnInit() {
    this.route.paramMap.subscribe(
      (params: ParamMap) => {
        this.refreshTicket(params.get('id'));
      }
    );
  }

  private refreshTicket(id: string) {
    this.progressRefreshTicket = true;
    const handle404 = () => {
      this.router.navigate(['404']);
    };

    this.ticket$ = this.ticketService.getOne(id).share();
    this.ticketWatcherSubscription = this.ticket$.subscribe(
      ticket => {
        this.progressRefreshTicket = false;
        if (ticket === null) {
          handle404();
        }
      },
      err => {
        return handle404();
      }
    );
  }
}
