import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SidebarComponent } from './sidebar.component';
import {RouterModule, Routes} from '@angular/router';

@NgModule({
  declarations: [
    SidebarComponent
  ],
  imports: [
	RouterModule,
	NgxSpinnerModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [SidebarComponent]
})
export class SidebarModule {
}
