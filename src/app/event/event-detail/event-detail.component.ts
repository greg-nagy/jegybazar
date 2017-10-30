import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../../shared/event.service';
import { EventModel } from '../../shared/event-model';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {
  event: EventModel;

  constructor(private _route: ActivatedRoute,
              private _eventService: EventService) {
  }

  ngOnInit() {
    // tanulsagos dolog, hogy ebben az esetben number-re kell castolni,
    // mert routing-ban ami jon az biza string
    const evId = +this._route.snapshot.params['id'];
    if (evId) {
      this.event = this._eventService.getEventById(evId);
      console.log('kaptunk eventid-t', evId);
      console.log('kaptunk eventet', this.event);
    } else {
      this.event = new EventModel(EventModel.emptyEvent);
      console.log('nem kaptunk eventetet, uh csinaltunk gyorsan');
    }
  }

}
