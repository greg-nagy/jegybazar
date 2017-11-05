import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/zip';
import 'rxjs/add/operator/mergeMap';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { EventModel } from './event-model';
import { EventService } from './event.service';
import { TicketModel } from './ticket-model';
import { UserModel } from './user-model';
import { UserService } from './user.service';

@Injectable()
export class TicketService {

  constructor(private _eventService: EventService,
              private _userService: UserService,
              private _http: HttpClient) {
  }

  // Mi is tortenik itt, mert izi :) - logikai lepesekkel, hogy hogyan epulunk fel
  // 1. lepesben lekerjuk http.get-el az osszes ticketet, amik objectben erkeznek meg
  //    {key1: ticketObject1, key2: TicketObject2, key3: ticketObject3, ...}
  // 2. lepesben ezt atalakitjuk tombbe Object.values() segitsegevel
  //    [ticketObject1, ticketObject2, ticketObject3, ...]
  // 3. lepesben vegigmegyunk minden ticketObjectX-en es az Observable.zip() segitsegevel minden ticketObjectX-t atalakitunk
  //    3.a) krealunk 3 streamet: ticketObjectX-nek, illetve Eventnek es Usernek a ticketObjectX-ben tarolt id-k alapjan
  //      ticketObjectX-nek azert kell observable-t generalni, hogy alkalmazni tudjuk ra is a .zip()-et
  //    3.b) miutan a 2 uj streamunk is visszatert ertekkel egybefuzzuk az utolso parameterkent megadott fat arrow function-el
  //    3.c) es csinalunk belole egy uj streamet, amiben 1 ertek van, es ez az osszefuzott verzio
  //         ezen a ponton van egy [zipStream1, zipStream2, zipStream3, ...]
  // 4. osszeallitjuk a vegso streamunket
  //    4.a) Observable.forkJoin segitsegevel az osszes tombben kapott streamunk utolso elemet osszefuzzuk 1 tombbe
  //         es a keletkezett uj streamen ezt az 1 elemet emitteljuk
  //    4.b) mivel minket csak az osszefuzott ertek erdekel a streamen ezert a switchmap-el erre valtunk
  // ----------
  // Gondolatkiserlet: itt azert erdemes megnezni a devtoolbar network tabjat XHR szuresben,
  //                   es vegiggondolni, hogy hogy lehetne spórolni ezekkel a keresekkel!
  // -----
  // puffancs uzeni: "elkepzelheto", hogy egyszerubb megoldas is van, de szerintem ez szep
  //                 es mar nagyon vagytam valami agyzsibbasztora a projektben :)
  getAllTickets() {
    return this._http.get(`${environment.firebase.baseUrl}/tickets.json`)
      .map(ticketsObject => Object.values(ticketsObject))
      .map(ticketsArray => ticketsArray.map(tm =>
        Observable.zip(
          Observable.of(tm),
          this._eventService.getEventById(tm.eventId),
          this._userService.getUserById(tm.sellerUserId),
          (t: TicketModel, e: EventModel, u: UserModel) => {
            return {
              ...t,
              event: e,
              seller: u
            };
          })
      ))
      .switchMap(zipStreamArray => Observable.forkJoin(zipStreamArray))
      ;
  }

  create(param: TicketModel) {
    return this._http
      .post<{ name: string }>(`${environment.firebase.baseUrl}/tickets.json`, param)
      // konnyitsuk meg magunknak kicsit az eletunket es kuldjuk tovabb csak azt ami kell nekunk
      .map(fbPostReturn => fbPostReturn.name)
      // ez itt amiatt kell, hogy meglegyen a fbid objektumon belul is,
      // mert kesobb epitunk erre az infora
      // viszont ezt csak a post valaszaban kapjuk vissza
      // es legalabb hasznaljuk a patch-et is :)
      .switchMap(ticketId => this._saveGeneratedId(ticketId))
      // keszitsuk kicsit elo a jovilagot es vezessuk esemenyeknel is a hozzajuk tartozo ticketeket
      .switchMap(ticketId => this._eventService.addTicket(param.eventId, ticketId))
      // keszitsuk kicsit elo a jovilagot es vezessuk a profilunknal a hozzank tartozo ticketeket
      .switchMap(ticketId => this._userService.addTicket(ticketId))
      ;
  }

  private _saveGeneratedId(ticketId: string): Observable<string> {
    return this._http.patch<{ id: string }>(
      `${environment.firebase.baseUrl}/tickets/${ticketId}.json`,
      {id: ticketId}
    )
      .map(x => x.id);
  }
}
