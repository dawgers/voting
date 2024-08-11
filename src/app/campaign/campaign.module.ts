import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CampaignComponent } from './campaign.component';
import { CampaignRoutingModule } from './campaign-routing.module'; // Import the routing module


@NgModule({
  declarations: [CampaignComponent],
  imports: [
    CommonModule,
    CampaignRoutingModule // Add the routing module to imports
  ],
  exports: [CampaignComponent] // Exporting the component
})
export class CampaignModule { }
