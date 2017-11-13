import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TicketComponent {}
