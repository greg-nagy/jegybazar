import { AfterViewChecked, Component, DoCheck } from '@angular/core';

@Component({
  selector: 'app-jumbotron',
  templateUrl: './jumbotron.component.html',
  styleUrls: ['./jumbotron.component.css']
})
export class JumbotronComponent implements DoCheck, AfterViewChecked {

  ngDoCheck(): void {
    console.log('JumbotronComponent ngDoCheck');
  }

  ngAfterViewChecked(): void {
    console.log('JumbotronComponent ngAfterViewChecked');
  }
}
