import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FooterComponent } from './footer.component';
import {RouterModule, Routes} from '@angular/router';

@NgModule({
  declarations: [
    FooterComponent
  ],
  imports: [
	RouterModule,
	NgxSpinnerModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [FooterComponent]
})
export class FooterModule {
}
