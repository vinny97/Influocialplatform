import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { ProfileComponent } from './profile/profile.component';


const routes: Routes = [
  { path: '', component: ListComponent },
  { path: 'profile/:userID', component: ProfileComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
