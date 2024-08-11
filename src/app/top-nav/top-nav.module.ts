import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TopNavComponent } from './top-nav.component';
import {RouterModule, Routes} from '@angular/router';
import { TopNavRoutingModule } from './top-nav-routing.module';


@NgModule({
  declarations: [
    TopNavComponent
  ],
  imports: [
	RouterModule,
	NgxSpinnerModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // TopNavRoutingModule
  ],
  exports: [TopNavComponent]
})
export class TopNavModule {
}
