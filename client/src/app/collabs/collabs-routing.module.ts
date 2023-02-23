import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollabsComponent } from './collabs.component';
import { ListComponent } from './list/list.component';
import { ResubmissionChangesComponent } from './resubmission-changes/resubmission-changes.component';
import { SubmitContentBrandComponent } from './submit-content-brand/submit-content-brand.component';
import { SubmitComponent } from './submit/submit.component';
import { ViewComponent } from './view/view.component';

const routes: Routes = [
  { path: '', component: CollabsComponent },
  { path: 'list/:type', component: ListComponent },
  { path: 'submit/:proposalID', component: SubmitComponent },
  { path: 'edit-submission/:proposalID', component: SubmitComponent },
  { path: 'outright/:proposalID', component: SubmitComponent },
  { path: 'view/:proposalID', component: ViewComponent },
  { path: 'submitbybrand/:proposalID', component: SubmitContentBrandComponent },
  {
    path: 'resubmitProposal/:proposalID',
    component: ResubmissionChangesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CollabsRoutingModule {}
