import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';
import { EventModel } from '../../shared/event-model';
import { EventService } from '../../shared/event.service';
import { UserService } from '../../shared/user.service';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit, OnDestroy {
  event: EventModel;
  viewForm = true;

  // ezt a subject-et fojuk hasznalni az ossszes subscription zárására
  private _destroy$ = new Subject<void>();

  constructor(private _route: ActivatedRoute,
              private _eventService: EventService,
              private _location: Location,
              public userService: UserService) {
  }

  ngOnInit() {
    const evId = this._route.snapshot.params['id'];

    // ez egy megoldas arra, hogy egyben kezeljuk az edit es create funkcionalitast
    // illetve edit esetben is van mivel dolgozni amig megerkezik az adat igy user mindig lat valamit
    this.event = new EventModel();

    // ha nincs eventId-nk akkor ujat hozunk letre es emiatt szerkesztessel indulunk
    // ha van eventId-nk akkor viszont eloszot megjelenitunk es szerkeszt gombra valtunk
    this.viewForm = !!evId; // a !! egy dupla negalas amit arra hasznalunk, hogy fix true/false-t kapjunk barmilyen ertekbol

    // ezt a reszt izgalmas atirni swithmap-el meg startsWith-el es nem snapshotbol dolgozni
    if (evId) {
      this._eventService.getEventById(evId)
        .takeUntil(this._destroy$)
        .subscribe(evm => this.event = evm);
      console.log('kaptunk eventid-t', evId);
    }
  }

  // ez a fgv a komponens pusztulasakor fog lefutni
  ngOnDestroy() {
    // es a takeUntil()-eken keresztul jelzunk minden stream-nek hogy zarodjon
    // igaz ez ebben az esetben kicsit eroltett pl mert, bár __MOST__
    //   tudjuk, hogy minden streamunk http ami szepen zarja magát, de ez nem lesz mindig így
    //   ezért elkezdjuk megszokni mint mintat, mert kesobb ez jol jon, hogy pedansak vagyunk
    // http://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
    this._destroy$.next();

    // persze zarjuk a zaro streamunket is
    this._destroy$.complete();
  }

  onSubmit() {
    this._eventService.save(this.event)
      .takeUntil(this._destroy$)
      .subscribe(
        () => this.navigateBack(),
        (err) => {
          console.warn(`Problémánk van a form mentésnél: ${err}`);
        }
      );
  }

  delete() {
    this._eventService.delete(this.event)
      .takeUntil(this._destroy$)
      .subscribe(
        () => this.navigateBack(),
        (err) => {
          console.warn(`Problémánk van a form mentésnél: ${err}`);
        }
      );
  }

  navigateBack() {
    this._location.back();
  }
}
