import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { RetargetRoutingModule } from './retarget-routing.module';
import { PurchasedComponent } from './purchased/purchased.component';
import { PastComponent } from './past/past.component';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { GroupsComponent } from './groups/groups.component';
import { ViewGroupComponent } from './view-group/view-group.component';
import { WidgetModule } from '../widgets/widget.module';
import { AddGroupMemberComponent } from './add-group-member/add-group-member.component';
import { GroupCardComponent } from './group-card/group-card.component';
import { MemberViewComponent } from './member-view/member-view.component';
import { RemoveMemberComponent } from './remove-member/remove-member.component';



@NgModule({
  declarations: [PurchasedComponent, PastComponent, ViewProfileComponent, GroupsComponent, ViewGroupComponent,
    MemberViewComponent,
    GroupCardComponent,
    AddGroupMemberComponent,
    RemoveMemberComponent,],
  imports: [
    CommonModule,
    RetargetRoutingModule,
    SharedModule,
    WidgetModule,
  ]
})
export class RetargetModule { }
