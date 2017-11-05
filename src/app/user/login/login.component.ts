import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserModel } from '../../shared/user-model';
import { UserService } from '../../shared/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public error: string;

  constructor(private _userService: UserService,
              private _router: Router) {
  }

  ngOnInit() {
  }

  login(email: string, password: string) {
    this._userService.login(email, password).subscribe(
      (user: UserModel) => {
        this._router.navigate(['/user']);
      },
      err => console.warn('hibara futottunk a logincmp-ben', err)
    );
  }

  clearError() {
    delete(this.error);
  }

}
