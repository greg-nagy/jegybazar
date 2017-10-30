import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/user.service';
import { UserModel } from '../../shared/user-model';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit {
  user: UserModel;

  constructor(private _userService: UserService) { }

  ngOnInit() {
    this.user = this._userService.getCurrentUser();
  }

}
