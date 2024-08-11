import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {NgxSpinnerModule} from 'ngx-spinner';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { MyHttpInterceptor } from './my-http-interceptor';
import {LoginComponent} from './login/login.component';
//import {PolygonListComponent} from './polygon-list/polygon-list.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule, DatePipe} from '@angular/common';
//mport {DashboardComponent} from './dashboard/dashboard.component';
import {NeedAuthGuard} from './auth.guard';
import {AgmCoreModule} from '@agm/core';
import { AgmDrawingModule } from '@agm/drawing';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SweetAlert2Module} from '@toverux/ngx-sweetalert2';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgBusyModule} from 'ng-busy';
import {NgxPaginationModule} from 'ngx-pagination';
import { GoogleMapsAPIWrapper} from '@agm/core';
import { MetaConfig, MetaModule } from 'ng2-meta';
import {SocketClientService} from './socket-client.service';
import {WebsocketService} from './websocket.service';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import {ExcelService} from './excel.service';
import { RegisterComponent } from './register/register.component';
import { LoadingComponent } from './loading/loading.component';
import { CandidateModalComponent } from './candidate-modal/candidate-modal.component';
import { ChartsModule } from 'ng2-charts';
import { PpCandidatesComponent } from './pp-candidates/pp-candidates.component';

//import { AdminComponent } from './admin/admin.component';

//import { AudienceComponent } from './audience/audience.component';

const metaConfig: MetaConfig = {
  //Append a title suffix such as a site name to all titles
  //Defaults to false
  useTitleSuffix: true,
  defaults: {
    title: 'Drive Time Media',
    titleSuffix: '',
    'og:image': 'https://www.abc.com/image',
    'og:type': 'Website',
    'og:url': 'https://www.abc.com/'
  }
};


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LoadingComponent,
    CandidateModalComponent,
   
    
    // RegisterComponent,
  ],
  imports: [
    NgxPaginationModule,
    NgBusyModule,
    NgbModule,
    NgxSpinnerModule,
    ChartsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    MatSnackBarModule,
    CommonModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
	InfiniteScrollModule ,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBWaVYEu1n2cDwX24g67d2gXvVbIvxPKpU',
      libraries: ["places", "drawing","visualization"]
    }),
	AgmDrawingModule,
    MetaModule.forRoot(metaConfig),

  ],
  providers: [
  NeedAuthGuard, DatePipe, GoogleMapsAPIWrapper, WebsocketService, SocketClientService,ExcelService,
  {
      provide: HTTP_INTERCEPTORS,
      useClass: MyHttpInterceptor,
      multi: true
    },
    {provide: LocationStrategy, useClass: PathLocationStrategy}],
  bootstrap: [AppComponent],
})
export class AppModule {
}
