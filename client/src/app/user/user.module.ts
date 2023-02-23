import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { UserRoutingModule } from './user-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ProfileComponent } from './profile/profile.component';
import { UserListFilterComponent } from './user-list-filter/user-list-filter.component';
import { UserListTableComponent } from './user-list-table/user-list-table.component';

@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule,
  ],
  declarations: [ListComponent, ProfileComponent, UserListFilterComponent, UserListTableComponent]
})
export class UserModule { }
