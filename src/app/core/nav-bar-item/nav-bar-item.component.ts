import { AfterViewChecked, Component, DoCheck, Input } from '@angular/core';

@Component({
  selector: 'app-nav-bar-item',
  templateUrl: './nav-bar-item.component.html',
  styleUrls: ['./nav-bar-item.component.css']
})
export class NavBarItemComponent implements DoCheck, AfterViewChecked {
  @Input() url: string;
  @Input() name: string;

  ngDoCheck(): void {
    // console.log('NavBarItemComponent ngDoCheck');
  }

  ngAfterViewChecked(): void {
    // console.log('NavBarItemComponent ngAfterViewChecked');
  }
}
