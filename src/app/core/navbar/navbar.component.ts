import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, DoCheck } from '@angular/core';
import { UserService } from '../../shared/user.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements DoCheck, AfterViewChecked, AfterViewInit {
  public isCollapsed = true;
  isLoggedIn = false;
  isCollapsedLanguageSwitcher = true;
  currentLang = 'hu';

  constructor(
    public userService: UserService,
    private cdr: ChangeDetectorRef,
    private translateService: TranslateService
  ) {
    this.userService.isLoggedIn$.subscribe(
      isLoggedIn => {
        this.isLoggedIn = isLoggedIn;
        this.cdr.detectChanges();
      }
    );

    this.translateService.onLangChange.subscribe(
      newLang => {
        this.currentLang = newLang.lang;
        this.isCollapsedLanguageSwitcher = true;
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

  toggleLanguageSwitcher($event) {
    $event.stopPropagation();
    $event.preventDefault();

    this.isCollapsedLanguageSwitcher = !this.isCollapsedLanguageSwitcher;
    this.cdr.detectChanges();
  }

  selectLang(lang: string, $event) {
    $event.stopPropagation();
    $event.preventDefault();

    this.translateService.use(lang);
  }

  toggleMenu() {
    this.isCollapsed = !this.isCollapsed;
    this.cdr.detectChanges();
  }
}
