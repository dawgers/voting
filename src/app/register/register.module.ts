
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterRoutingModule } from './register-routing.module';
import { RegisterComponent } from './register.component';
import {FooterModule} from '../footer/footer.module';
import {SidebarModule} from '../sidebar/sidebar.module';
// import { ReportOneComponent } from './report-one/report-one.component';
import {NgxSpinnerModule} from 'ngx-spinner';
// import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import {MatSortModule, MatTooltipModule} from '@angular/material';


// import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
// import { ReportTwoComponent } from './report-two/report-two.component';

@NgModule({
  imports: [
    SidebarModule,
    FooterModule,
    
    CommonModule,
    NgxSpinnerModule,
    NgxDaterangepickerMd,
    FormsModule,
    MatSortModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    RegisterRoutingModule,
    InfiniteScrollModule
    ],
  declarations: [RegisterComponent]
})
export class RegisterModule {
}
