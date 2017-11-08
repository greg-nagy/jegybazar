import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TicketModel } from '../../shared/ticket-model';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-bid-form',
  templateUrl: './bid-form.component.html',
  styleUrls: ['./bid-form.component.css']
})
export class BidFormComponent implements OnInit {
  @Input() ticket: TicketModel;
  @Output() bidWithBidStep = new EventEmitter<void>();
  displayBidStep = true;
  form: FormGroup;

  constructor(
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group(
      {
        bid: null
      }
    );
  }

  onBidWithBidStep() {
    this.bidWithBidStep.emit();
  }

  displayBidWithStep($event: Event) {
    $event.preventDefault();

    this.displayBidStep = false;
  }

  onSubmit() {
    console.log('Licitaltak');
  }
}
