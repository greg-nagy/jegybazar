import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, DoCheck } from '@angular/core';
import { UserService } from '../../shared/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements DoCheck, AfterViewChecked, AfterViewInit {
  public isCollapsed = true;
  isLoggedIn = false;

  constructor(
    public userService: UserService,
    private cdr: ChangeDetectorRef
  ) {
    this.userService.isLoggedIn$.subscribe(
      isLoggedIn => {
        this.isLoggedIn = isLoggedIn;
        this.cdr.detectChanges();
      }
    );
  }

  ngAfterViewInit(): void {
    this.cdr.detach();
  }

  ngDoCheck(): void {
    // console.log('NavbarComponent ngDoCheck');
  }

  ngAfterViewChecked(): void {
    // console.log('NavbarComponent ngAfterViewChecked');
  }

  logout() {
    this.userService.logout();
  }

}
