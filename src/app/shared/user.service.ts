import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { FirebaseLoginModel } from './firebase-login-model';
import { UserModel } from './user-model';
import 'rxjs/add/operator/do';

@Injectable()
export class UserService {
  isLoggedin = false;

  private _user: UserModel;
  private _allUsers: UserModel[];

  constructor(private _router: Router,
              private _http: HttpClient) {
    this._allUsers = this._getMockData();
  }

  login(email: string, password: string): Observable<UserModel | void> {
    return this._http.post<FirebaseLoginModel>(
      `${environment.firebase.loginUrl}?key=${environment.firebase.apikey}`,
      {
        'email': email,
        'password': password,
        'returnSecureToken': true
      })
      .switchMap(fbLogin => this._http.get<UserModel>(`${environment.firebase.baseUrl}/users/${fbLogin.localId}.json`))
      .do(user => this.isLoggedin = true)
      .do(user => this._user = user)
      ;
  }

  register(param?: UserModel) {
    if (param) {
      this._user = new UserModel({
        id: 4,
        ...param
      });

      this._allUsers = [
        ...this._allUsers,
        this._user
      ];
    }
    this.isLoggedin = true;
    console.log('be vagyunk-e lepve:', this.isLoggedin);
  }

  logout() {
    this._user = new UserModel();
    this.isLoggedin = false;
    this._router.navigate(['/home']);
    console.log('be vagyunk-e lepve:', this.isLoggedin);
  }

  updateUser(param: UserModel) {
    this._user = new UserModel(param);
  }

  getUserById(id: number) {
    const user = this._allUsers.filter(u => u.id === +id);
    return user.length > 0 ? user[0] : new UserModel(UserModel.emptyUser);
  }

  getCurrentUser() {
    return this._user ? this._user : new UserModel(UserModel.emptyUser);
  }

  private _getMockData() {
    return [
      new UserModel({
        'id': 0,
        'name': 'Legyek Réka Matlida',
        'email': 'legyekrekamatilda@valami.com',
        'address': 'Futrinka utca',
        'dateOfBirth': '2001.01.01',
        'gender': 'female',
        'profilePictureUrl': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4nBubms8tp5EDXG6LBhVyy4AES2WCqceh674hyF6rNwjYoJ4ddQ'
      }),
      new UserModel({
        'id': 1,
        'name': 'Pista ba',
        'email': 'pistaba@pistaba.com',
        'address': 'pistaba lak 12',
        'dateOfBirth': '1900-01-01',
        'gender': 'male',
        'profilePictureUrl': 'http://3.bp.blogspot.com/-bUS0WbXC1YA/Uz0di05mS_I/AAAAAAAAQGg/u9o_g9VDTSg/s1600/pista_ba_animacio.jpg'
      }),
      new UserModel({
        'id': 2,
        'name': 'Marcsa',
        'email': 'marcsa@marcsa.hu',
        'address': 'marcsa var 42.',
        'dateOfBirth': '2000-01-01',
        'gender': 'female',
        'profilePictureUrl': 'https://i.pinimg.com/236x/2c/80/53/2c80536d805ca08bd1f87d9db9fb9955--funny-wallpapers-wallpaper-iphone.jpg'
      }),
      new UserModel({
        'id': 3,
        'name': 'ifju satan',
        'email': 'mzx@mzx.hu',
        'address': 'namek',
        'dateOfBirth': '2199-02-01',
        'gender': 'male',
        'profilePictureUrl': 'https://www.minihero.hu/wp-content/uploads/funko-pop-ifju-satan.jpg'
      }),
    ];
  }

}
