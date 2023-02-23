import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Step1Component } from './create/step1/step1.component';
import { Step2Component } from './create/step2/step2.component';
import { Step3Component } from './create/step3/step3.component';
import { Step4Component } from './create/step4/step4.component';
import { CampaignRoutingModule } from './campaigns-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ListComponent } from './list/list.component';
import { TypeComponent } from './create/type/type.component';
import { CreateLayoutComponent } from './create/create-layout/create-layout.component';
import { CreateCampaignService } from './create/create-campaign.service';
import { FacebookModule } from 'ngx-facebook';

import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { OverlayModule } from '@angular/cdk/overlay';
import { A11yModule } from '@angular/cdk/a11y';
import { PortalModule } from '@angular/cdk/portal';
import { InfluencerListComponent } from './influencer-list/influencer-list.component';
import { DetailComponent } from './detail/detail.component';
import { AdminListComponent } from './admin-list/admin-list.component';
import { AdminActionsComponent } from './admin-actions/admin-actions.component';
import { RejectMessageComponent } from './reject-message/reject-message.component';

@NgModule({
  declarations: [
    CreateLayoutComponent,
    Step1Component,
    Step2Component,
    Step3Component,
    Step4Component,
    ListComponent,
    AdminListComponent,
    InfluencerListComponent,
    DetailComponent,
    TypeComponent,
    AdminActionsComponent,
    RejectMessageComponent,
  ],
  imports: [
    CommonModule,
    CampaignRoutingModule,
    SharedModule,
    OverlayModule,
    A11yModule,
    PortalModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    FacebookModule.forRoot(),
  ],
  exports: [ListComponent],
  providers: [CreateCampaignService],
})
export class CampaignsModule {}
