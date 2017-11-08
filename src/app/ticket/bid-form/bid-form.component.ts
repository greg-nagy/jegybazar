import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TicketModel } from '../../shared/ticket-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { bidMinimumValidator } from './bid.validators';
import { BidService } from '../../shared/bid.service';

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
  submitted = false;
  submitSuccessAlert = false;
  submitErrorAlert = false;

  constructor(
    private fb: FormBuilder,
    private bidService: BidService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group(
      {
        bid: [
          null,
          Validators.compose(
            [
              Validators.required,
              bidMinimumValidator(this.ticket.currentBid + this.ticket.bidStep)
            ]
          )
        ]
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
    this.submitted = true;
    this.submitSuccessAlert = false;
    this.submitErrorAlert = false;

    if (this.form.valid) {
      this.bidService.bid(this.ticket.id, this.form.value['bid'])
        .subscribe(
          () => {
            this.submitted = false;
            this.form.reset({ bid: null });
            // notification user
            this.submitSuccessAlert = true;
            // TODO emit output bid
          },
          err => {
            console.error(err);
            this.submitErrorAlert = true;
          }
        );
    }
    console.log('Licitaltak');
    console.log(this.form.value);
    console.log(this.form.valid);
  }
}
