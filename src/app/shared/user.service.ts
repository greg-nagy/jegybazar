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
import { AngularFireDatabase } from 'angularfire2/database';
import { UserInfo } from 'firebase/app';
import 'rxjs/add/operator/first';

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
    return Observable.fromPromise(this.afAuth.auth.signInWithEmailAndPassword(email, password));
  }

  register(param: UserModel, password: string) {
    return Observable.fromPromise(
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

  // getAllUsers() {
  //   return this._http.get(`${environment.firebase.baseUrl}/users.json`)
  //     .map(usersObject => Object.values(usersObject).map(user => new UserModel(user)));
  // }

  addTicket(ticketId: string): Observable<string> {
    return this._user.first().flatMap(
      user => {
        return this.afDb.list(`users/${user.id}/tickets`).push(ticketId);
      });
  }
}
