import { Component, OnInit } from '@angular/core';
import { TicketService } from '../../shared/ticket.service';
import { TicketModel } from '../../shared/ticket-model';
import { UserService } from '../../shared/user.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-bid',
  templateUrl: './bid.component.html',
  styleUrls: ['./bid.component.css']
})
export class BidComponent implements OnInit {
  ticket: TicketModel;
  isLoggedIn: boolean;

  constructor(
    private ticketService: TicketService,
    userService: UserService,
    private route: ActivatedRoute
  ) {
    this.isLoggedIn = userService.isLoggedin;
  }

  ngOnInit() {
    this.route.paramMap.subscribe(
      (params: ParamMap) => {
        this.ticketService.getOne(params.get('id')).subscribe(
          ticket => this.ticket = ticket
        );
      }
    );
  }
}
