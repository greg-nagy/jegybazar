import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { UserService } from './user.service';

@Injectable()
export class LoggedInGuardGuard implements CanActivate {
  constructor(
    private _userService: UserService,
    private _router: Router
  ) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this._userService.isLoggedIn$.map(
      isLoggedIn => {
        if (isLoggedIn === false) {
          this._router.navigate(['/home']);
          return false;
        }
        return true;
      }
    );
  }
}
