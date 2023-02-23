import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminListComponent } from './admin-list/admin-list.component';
import { CreateLayoutComponent } from './create/create-layout/create-layout.component';
import { DetailComponent } from './detail/detail.component';
import { InfluencerListComponent } from './influencer-list/influencer-list.component';
import { ListComponent } from './list/list.component';

const routes: Routes = [
  { path: '', component: ListComponent },
  { path: 'admin-list', component: AdminListComponent },
  { path: 'create', component: CreateLayoutComponent },
  { path: 'influencer-campaign-list', component: InfluencerListComponent },
  { path: ':id', component: DetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CampaignRoutingModule {}
