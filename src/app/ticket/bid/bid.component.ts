import { Component, OnInit } from '@angular/core';
import { TicketService } from '../../shared/ticket.service';
import { TicketModel } from '../../shared/ticket-model';
import { UserService } from '../../shared/user.service';

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
    userService: UserService
  ) {
    this.isLoggedIn = userService.isLoggedin;
  }

  ngOnInit() {
    const id = '-Ky0HolLJBH3Q5uVHWZf';
    this.ticketService.getOne(id).subscribe(
      ticket => this.ticket = ticket
    );
  }
}
