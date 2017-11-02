import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserModel } from './user-model';

@Injectable()
export class UserService {
  isLoggedin = false;

  private _user: UserModel;
  private _allUsers: UserModel[];

  constructor(private _router: Router) {
    this._allUsers = this._getMockData();
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

  updateUser(param: UserModel) {
    this._user = new UserModel(param);
  }

  getUserById(id: number) {
    const user = this._allUsers.filter(u => u.id === +id);
    return user.length > 0 ? user[0] : new UserModel(UserModel.emptyUser);
  }

  getCurrentUser() {
    return this._user;
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
