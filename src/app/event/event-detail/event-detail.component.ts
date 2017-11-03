import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventModel } from '../../shared/event-model';
import { EventService } from '../../shared/event.service';
import { UserService } from '../../shared/user.service';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {
  event: EventModel;
  editForm = false;

  constructor(private _route: ActivatedRoute,
              private _eventService: EventService,
              private _location: Location,
              public userService: UserService) {
  }

  ngOnInit() {
    // tanulsagos dolog, hogy ebben az esetben number-re kell castolni,
    // mert routing-ban ami jon az biza string
    const evId = this._route.snapshot.params['id'];
    this.event = new EventModel(EventModel.emptyEvent);
    if (evId) {
      this._eventService.getEventById(evId)
        .subscribe(evm => this.event = evm);
      console.log('kaptunk eventid-t', evId);
      console.log('kaptunk eventet', this.event);
      this.editForm = true;
    }
  }

  onSubmit(form) {
    if (this.event.id) {
      console.log('update agban vagyunk');
      this._eventService.update(this.event);
    } else {
      console.log('create agban vagyunk');
      this._eventService.create(this.event);
    }
    this._location.back();
  }

  navigateBack() {
    this._location.back();
  }
}
