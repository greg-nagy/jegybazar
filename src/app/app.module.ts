import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AlertModule, CollapseModule } from 'ngx-bootstrap';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { LoggedInGuardGuard } from './shared/logged-in-guard.guard';
import { TicketService } from './shared/ticket.service';
import { UserService } from './shared/user.service';
import { TicketDetailsCardComponent } from './ticket/ticket-details-card/ticket-details-card.component';
import { BiddingCardComponent } from './ticket/bidding-card/bidding-card.component';
import { MomentModule } from 'angular2-moment';
import 'moment/locale/hu';
import { BidFormComponent } from './ticket/bid-form/bid-form.component';
import { BidService } from './shared/bid.service';
import { environment } from '../environments/environment';
import { EventcardModule } from './event/eventcard/eventcard.module';
import { CoreModule } from './core/core.module';
import { EventModule } from './event/event.module';
import { ChatModule } from './chat/chat.module';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { ServiceWorkerModule } from './@angular/service-worker/src';
import { AngularFireDatabaseModule } from 'angularfire2/database-deprecated';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    ...AppRoutingModule.routableComponents,
    TicketDetailsCardComponent,
    BiddingCardComponent,
    BidFormComponent
  ],
  imports: [
    BrowserModule,
    environment.production ? ServiceWorkerModule.register('/ngsw-worker.js') : [],
    FormsModule,
    ReactiveFormsModule,
    CollapseModule.forRoot(),
    AlertModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    MomentModule,
    EventcardModule,
    CoreModule,
    EventModule.forRoot(),
    ChatModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    UserService,
    TicketService,
    LoggedInGuardGuard,
    BidService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(translateService: TranslateService) {
    translateService.setDefaultLang('hu');

    translateService.use('en');
  }
}
