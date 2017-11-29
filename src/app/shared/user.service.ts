import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { UserModel } from './user-model';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/mergeMap';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { UserInfo } from 'firebase/app';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/catch';
import * as moment from 'moment';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';

@Injectable()
export class UserService {
  isLoggedIn$ = new ReplaySubject<boolean>(1);

  private _user = new ReplaySubject<UserModel>(1);

  constructor(
    private _router: Router,
    // private _http: HttpClient,
    private afAuth: AngularFireAuth,
    private afDb: AngularFireDatabase
  ) {
    this.afAuth.authState.subscribe(
      user => {
        if (user != null) {
          this.userOnlineDetect(user);

          this.getUserById(user.uid).subscribe(remoteUser => {
            this._user.next(remoteUser);
            this.isLoggedIn$.next(true);
          });
        } else {
          this._user.next(null);
          this.isLoggedIn$.next(false);
        }
      }
    );
  }

  login(email: string, password: string): Observable<UserModel | void> {
    return fromPromise(this.afAuth.auth.signInWithEmailAndPassword(email, password));
  }

  register(param: UserModel, password: string) {
    return fromPromise(
      this.afAuth.auth.createUserWithEmailAndPassword(param.email, password)
    )
      .do(
        (user: UserInfo) => this.save({ ...param, id: user.uid })
      );
  }

  save(param: UserModel) {
    return this.afDb.object(`users/${param.id}`).set(param)
      .then(
        user => user
      );
  }

  getUserById(fbid: string) {
    return this.afDb.object(`users/${fbid}`);
  }

  getCurrentUser() {
    return this._user.asObservable();
  }

  logout() {
    this.afAuth.auth.signOut();
    this._router.navigate(['/home']);
    console.log('kileptunk');
  }

  addTicket(ticketId: string): Observable<string> {
    return this._user.first().flatMap(
      user => {
        return this.afDb.list(`users/${user.id}/tickets`).push(ticketId);
      });
  }

  // getAllUsers() {
  //   return this._http.get(`${environment.firebase.baseUrl}/users.json`)
  //     .map(usersObject => Object.values(usersObject).map(user => new UserModel(user)));
  // }

  /**
   * Ez a metodus felel azert hogyha online vagyok akkor a barataim csomopontjaiba a sajat useremnel az online-t kezelje
   * @param user
   */
  private userOnlineDetect(user) {
    // specialis firebase path, a sajat connection allapotomat lehet vele vizsgalni
    this.afDb.object('.info/connected').switchMap(
      connected => {
        if (connected.$value === true) {
          // ha csatlakozva vagyok akkor vissza kerem a barataim listajat
          return this.afDb.list(`chat_friend_list/${user.uid}`, { preserveSnapshot: true });
        }
        return of([]);
      }
    )
      .subscribe(
        friendsSnapshot => {
          if (friendsSnapshot.length > 0) {
            // Ha vannak barataim akkor ossze allitok egy listat a frissitendo path-okrol
            // (ezzel a modszerrel tobb utvonalat tudunk egyszerre frissiteni)

            // firebase ebben az esetben array like object-et ker, ezert nem tombot hasznalunk
            const updateOnline = {};
            // minden baratunknal a sajat csomopontunkat kigyujtjuk es beallitjuk neki hogy online vagyunk
            friendsSnapshot.forEach(
              snapshot => {
                updateOnline[`chat_friend_list/${snapshot.key}/${user.uid}/online`] = true;
              }
            );
            // root csomopont referencia elekerese
            const rootAfDb = this.afDb.app.database().ref();
            // mivel a root csomoponttol adtuk meg az updateOnline-t ezert arra hivjuk az updatet
            // !FELHIVAS! nagyon vigyazz ezzel mert ha valami rosszul adsz meg akkor akar az egesz adatbazist torolheted!
            rootAfDb.update(updateOnline);

            // amikor majd megkapjuk a disconnect esemenyt akkor szeretnenk torolni az online flag-et, ezert
            // lemasoljuk az updateOnline-t de null ertekkel ami miatt firebase torolni fogja
            const updateOffline = {};
            friendsSnapshot.forEach(
              snapshot => {
                updateOffline[`chat_friend_list/${snapshot.key}/${user.uid}/online`] = false;
                updateOffline[`chat_friend_list/${snapshot.key}/${user.uid}/lastOnline`] = moment().unix();
              }
            );

            // disconnect eseten update-vel frissitjuk az ertekeket(a null miatt majd torlodni fog)
            rootAfDb.ref.onDisconnect().update(updateOffline);
          }
        }
      );
  }
}
