import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MeasureCampaignsListComponent } from './measure-campaigns-list/measure-campaigns-list.component';
import { MeasurePostComponent } from './measure-post/measure-post.component';
import { MeasureViewComponent } from './measure-view/measure-view.component';
import { MeasureComponent } from './measure.component';

const routes: Routes = [
  { path: '', component: MeasureComponent },
  { path: 'view/:mediaID/:fee', component: MeasureViewComponent },
  { path: 'posts/:id', component: MeasurePostComponent },
  { path: ':brandId/campaigns', component: MeasureCampaignsListComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MeasureRoutingModule { }
