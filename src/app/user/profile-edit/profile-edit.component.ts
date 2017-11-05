import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { UserModel } from '../../shared/user-model';
import { UserService } from '../../shared/user.service';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit, OnDestroy {
  user: UserModel;

  private _destroy$ = new Subject();

  constructor(private _userService: UserService,
              private _router: Router) {
  }

  ngOnInit() {
    this.user = this._userService.getCurrentUser();
  }

  // ezt a mintat kifejtettem az event-eknel
  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }


  // mivel a regisztracio opcionalisan el a formon,
  // ezert alap viselkedesnek bekotottuk az save-t
  // ami a submit tipusu gomb megnyomasara hivodik meg ngSubmit-en keresztul
  updateUser() {
    this._userService.save(this.user)
      .takeUntil(this._destroy$)
      .subscribe(
        data => this._goToProfile(),
        err => console.warn('user save kozben problemank adodott: ', err)
      );
  }

  // ha regisztracios esetben vagyunk akkor viszont __NEM__ hasznalunk submit buttont
  // hanem sima type="button"-t es (click)-re hivjuk meg a create-t
  createUser(pass: string) {
    this._userService.register(this.user, pass)
      .takeUntil(this._destroy$)
      .subscribe(
        data => this._goToProfile(),
        err => console.warn('registracio kozben problemank adodott: ', err)
      );
  }

  private _goToProfile() {
    this._router.navigate(['/user']);
  }

}
