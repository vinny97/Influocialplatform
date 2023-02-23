import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { HttpTokenInterceptor } from './interceptors';
import { HeaderComponent } from './layout/header/header.component';
import { LayoutComponent } from './layout/layout.component';
import { NotificationsComponent } from './layout/notifications/notifications.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import {
  ApiService,
  BrandService,
  CampaignService,
  InstagramService,
  InstaService,
  JwtService,
  NoAuthGuard,
  SchedulerService,
  SettingsService,
  TransactionService,
  UserService,
} from './services';
import { AuthGuard } from './services/auth-guard.service';
import { ChatService } from './services/chat.service';
import { CollaborationsService } from './services/collaborations.service';
import { GroupService } from './services/group.service';
import { ManageUserService } from './services/manage-user.service';
import { ProposalService } from './services/proposal.service';
import { SocketService } from './services/socket.service';
import { StatService } from './services/stat.service';

@NgModule({
  declarations: [
    LayoutComponent,
    HeaderComponent,
    SidebarComponent,
    NotificationsComponent,
  ],
  imports: [CommonModule, HttpClientModule, RouterModule, SharedModule],
  exports: [LayoutComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true },
    ApiService,
    AuthGuard,
    NoAuthGuard,
    JwtService,
    UserService,
    BrandService,
    ChatService,
    CampaignService,
    GroupService,
    ManageUserService,
    SocketService,
    InstagramService,
    InstaService,
    ProposalService,
    StatService,
    TransactionService,
    SettingsService,
    SchedulerService,
    CollaborationsService
  ],
})
export class CoreModule { }
