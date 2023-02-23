import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { DashboardInfluencerComponent } from './dashboard-influencer/dashboard-influencer.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardStatCardComponent } from './dashboard-stat-card/dashboard-stat-card.component';
import { DashboardComponent } from './dashboard.component';

@NgModule({
  declarations: [
    DashboardComponent,
    DashboardAdminComponent,
    DashboardInfluencerComponent,
    DashboardStatCardComponent,
  ],
  imports: [CommonModule, DashboardRoutingModule, SharedModule],
})
export class DashboardModule {}
