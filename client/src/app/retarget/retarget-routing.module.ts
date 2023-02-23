import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GroupsComponent } from './groups/groups.component';
import { PastComponent } from './past/past.component';
import { PurchasedComponent } from './purchased/purchased.component';
import { ViewGroupComponent } from './view-group/view-group.component';
import { ViewProfileComponent } from './view-profile/view-profile.component';

const routes: Routes = [
  { path: '', component: PurchasedComponent },
  { path: 'past', component: PastComponent },
  { path: 'groups', component: GroupsComponent },
  { path: 'view-group/:groupID', component: ViewGroupComponent },
  { path: 'view-profile', component: ViewProfileComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RetargetRoutingModule { }
