import { TopNavModule } from '../top-nav/top-nav.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PPMapRoutingModule } from './pp-map-routing.module';
import { PPMapComponent } from './pp-map.component';
import {FooterModule} from '../footer/footer.module';
import {SidebarModule} from '../sidebar/sidebar.module';
// import { ReportOneComponent } from './report-one/report-one.component';
import {NgxSpinnerModule} from 'ngx-spinner';
// import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import {MatSortModule, MatTooltipModule} from '@angular/material';
import { NgxSliderModule } from '@angular-slider/ngx-slider';


// import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
// import { ReportTwoComponent } from './report-two/report-two.component';

@NgModule({
  imports: [
    NgxSliderModule,
    SidebarModule,
    FooterModule,
    TopNavModule,
    CommonModule,
    NgxSpinnerModule,
    NgxSliderModule,
    NgxDaterangepickerMd,
    FormsModule,
    MatSortModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    PPMapRoutingModule,
    InfiniteScrollModule
    ],
  declarations: [PPMapComponent]
})
export class PPMapModule {
}
