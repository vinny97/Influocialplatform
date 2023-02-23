import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentProposalComponent } from './content-proposal/content-proposal.component';
import { CreateComponent } from './create/create.component';
import { ListBrandComponent } from './list-brand/list-brand.component';
import { ViewProposalComponent } from './view-proposal/view-proposal.component';


const routes: Routes = [
  { path: 'view/:proposalID', component: ViewProposalComponent },
  { path: 'content/:proposalID', component: ContentProposalComponent },
  { path: 'create/:campaignID', component: CreateComponent },
  { path: 'campaign-proposals/:campaignID', component: ListBrandComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProposalRoutingModule { }
