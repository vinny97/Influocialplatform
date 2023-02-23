import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeasureRoutingModule } from './measure-routing.module';
import { SharedModule } from '../shared/shared.module';
import { MeasureComponent } from './measure.component';
import { MeasurePostComponent } from './measure-post/measure-post.component';
import { MeasureViewComponent } from './measure-view/measure-view.component';
import { BrandsModule } from '../brands/brands.module';
import { MeasureCampaignsListComponent } from './measure-campaigns-list/measure-campaigns-list.component';
import { CampaignsModule } from '../campaigns/campaigns.module';
import { MeasurePostCardComponent } from './measure-post-card/measure-post-card.component';
import { ProposalModule } from '../proposal/proposal.module';



@NgModule({
  declarations: [MeasureComponent, MeasurePostComponent, MeasureViewComponent, MeasureCampaignsListComponent, MeasurePostCardComponent],
  imports: [
    CommonModule,
    MeasureRoutingModule,
    SharedModule,
    ProposalModule,
    BrandsModule,
    CampaignsModule,
  ]
})
export class MeasureModule { }
