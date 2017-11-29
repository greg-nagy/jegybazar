import { Component, Optional } from '@angular/core';
import { UserService } from './shared/user.service';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import { SwUpdate } from './@angular/service-worker/src';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isLoggedIn$: ReplaySubject<boolean>;
  updateApp = false;
  translateVariable = { variableValue: 'valtozo szoveg' };

  constructor(
    userSerivce: UserService,
    @Optional() private swUpdate: SwUpdate
  ) {
    this.isLoggedIn$ = userSerivce.isLoggedIn$;
    this.initPwaUpdateWatcher();
  }

  updatePwa($event: Event) {
    $event.stopPropagation();
    $event.preventDefault();

    window.location.reload();
  }

  private initPwaUpdateWatcher() {
    if (environment.production) {
      this.swUpdate.available.subscribe(
        event => {
          console.log(event);
          this.updateApp = true;
        }
      );

      new TimerObservable(2000, 5000/*10 * 60 * 1000*/).subscribe(
        () => this.checkForUpdate()
      );
    }
  }

  private checkForUpdate() {
    console.log('start checkForUpdate');
    this.swUpdate.checkForUpdate()
      .then(
        () => console.log('finish checkForUpdate')
      )
      .catch(
        err => console.error(err)
      );
  }
}
