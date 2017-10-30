import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserModel } from './user-model';

@Injectable()
export class UserService {
  isLoggedin = false;

  private _user: UserModel;
  private _allUsers: UserModel[];

  constructor(private _router: Router) {
    this._allUsers = [
      new UserModel({
        'id': 1,
        'name': 'Pista ba',
        'email': 'pistaba@pistaba.com',
        'address': 'pistaba lak 12',
        'dateOfBirth': '1900-01-01',
        'gender': 'male'
      }),
      new UserModel({
        'id': 2,
        'name': 'Marcsa',
        'email': 'marcsa@marcsa.hu',
        'address': 'marcsa var 42.',
        'dateOfBirth': '2000-01-01',
        'gender': 'female'
      }),
      new UserModel({
        'id': 3,
        'name': 'ifju satan',
        'email': 'mzx@mzx.hu',
        'address': 'namek',
        'dateOfBirth': '2199-02-01',
        'gender': 'satan fattya'
      }),
    ];
  }

  login(email: string, password: string): boolean {
    if (email === 'angular' && password === 'angular') {
      this._user = new UserModel(UserModel.exampleUser);
      this.isLoggedin = true;
      this._router.navigate(['/user']);
    }
    console.log('be vagyunk-e lepve:', this.isLoggedin);
    return false;
  }

  register(param?: UserModel) {
    if (param) {
      this._user = new UserModel(param);
    } else {
      this._user = new UserModel(UserModel.exampleUser);
    }
    this.isLoggedin = true;
    this._router.navigate(['/user']);
    console.log('be vagyunk-e lepve:', this.isLoggedin);
  }

  logout() {
    this._user = new UserModel();
    this.isLoggedin = false;
    this._router.navigate(['/home']);
    console.log('be vagyunk-e lepve:', this.isLoggedin);
  }

  getUserById(id: number) {
    const user = this._allUsers.filter(u => u.id === id);
    return user.length > 0 ? user[0] : new UserModel(UserModel.emptyUser);
  }

}
