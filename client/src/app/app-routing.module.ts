import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AddNewComponent } from './add-new/add-new.component';
import { CalenderComponent } from './calender/calender.component';
import { ChatComponent } from './chat/chat.component';
import { AuthGuard, NoAuthGuard } from './@core';
import { FavouriteComponent } from './favourite/favourite.component';
import { LayoutComponent } from './@core/layout/layout.component';
import { ListComponent } from './list/list.component';
import { DiscoveryComponent } from './discovery/discovery.component';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'discover',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: 'discovery',
        component: DiscoveryComponent,
      },
      {
        path: 'proposal',
        loadChildren: () =>
          import('./proposal/proposal.module').then((m) => m.ProposalModule),
      },
      {
        path: 'collabs',
        loadChildren: () =>
          import('./collabs/collabs.module').then((m) => m.CollabsModule),
      },
      {
        path: 'capture',
        loadChildren: () =>
          import('./capture/capture.module').then((m) => m.CaptureModule),
      },
      {
        path: 'capture',
        loadChildren: () =>
          import('./capture/capture.module').then((m) => m.CaptureModule),
      },

      {
        path: 'users',
        loadChildren: () =>
          import('./user/user.module').then((m) => m.UserModule),
      },

      { path: 'list', component: ListComponent },
      { path: 'add-new', component: AddNewComponent },
      { path: 'favourite', component: FavouriteComponent },

      // { path: 'inf', loadChildren: () => import('./influencer/influencer.module').then(m => m.InfluencerModule) },

      {
        path: 'engage',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      { path: 'calender', component: CalenderComponent },
      {
        path: 'retarget',
        loadChildren: () =>
          import('./retarget/retarget.module').then((m) => m.RetargetModule),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./settings/settings.module').then((m) => m.SettingsModule),
      },
      {
        path: 'payments',
        loadChildren: () =>
          import('./payments/payments.module').then((m) => m.PaymentsModule),
      },
      {
        path: 'campaigns',
        loadChildren: () =>
          import('./campaigns/campaigns.module').then((m) => m.CampaignsModule),
      },

      {
        path: 'brands',
        loadChildren: () =>
          import('./brands/brands.module').then((m) => m.BrandsModule),
      },
      {
        path: 'brands/:brandId/campaigns',
        loadChildren: () =>
          import('./campaigns/campaigns.module').then((m) => m.CampaignsModule),
      },
      {
        path: 'chat',
        loadChildren: () =>
          import('./chat/chat.module').then((m) => m.ChatModule),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./profile/profile.module').then((m) => m.ProfileModule),
      },
      {
        path: 'interactions',
        loadChildren: () =>
          import('./interactions/interactions.module').then(
            (m) => m.InteractionsModule
          ),
      },
      {
        path: 'measure',
        loadChildren: () =>
          import('./measure/measure.module').then((m) => m.MeasureModule),
      },
    ],
  },

  // {
  //   path: 'influencer', component: InfluencerLayoutComponent, children: [
  //     { path: '', loadChildren: () => import('./influencer/influencer.module').then(m => m.InfluencerModule) },
  //     { path: 'chat', component: ChatComponent },
  //     { path: 'media-post', component: MediaPostComponent },
  //     { path: 'calender', component: CalenderComponent },
  //   ]
  // },
  
  { path: '', redirectTo: 'discover', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
