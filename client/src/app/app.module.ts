import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import {
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbModule,
} from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPermissionsModule, NgxPermissionsService } from 'ngx-permissions';
import { CoreModule } from './@core/core.module';
import { UserService } from './@core/services/user.service';
import { CustomAdapter } from './@helpers/custom-date.apter';
import { CustomDateParserFormatter } from './@helpers/date-parser.adapter';
import { AddNewComponent } from './add-new/add-new.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CalenderComponent } from './calender/calender.component';
import { FavouriteComponent } from './favourite/favourite.component';
import { ListComponent } from './list/list.component';
import { DiscoveryComponent } from './discovery/discovery.component';
import { SharedModule } from './shared/shared.module';

FullCalendarModule.registerPlugins([
  // register FullCalendar plugins
  dayGridPlugin,
  timeGridPlugin,
  listPlugin,
  interactionPlugin,
]);
@NgModule({
  declarations: [
    AppComponent,

    CalenderComponent,

    ListComponent,
    AddNewComponent,
    FavouriteComponent,
    DiscoveryComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgbModule,
    SharedModule,
    NgSelectModule,
    FullCalendarModule,
    CoreModule,
    NgxPermissionsModule.forRoot(),
  ],
  providers: [
    // { provide: APP_INITIALIZER, useFactory: appInitializer, multi: true },
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
    {
      provide: APP_INITIALIZER,
      useFactory: (us: UserService, ps: NgxPermissionsService) =>
        function () {
          return new Promise((resolve, reject) => {
            us.contextPopulate().subscribe(
              (user: any) => {
                resolve(true);
              },
              (error) => resolve(error)
            );
          });
        },
      deps: [UserService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
