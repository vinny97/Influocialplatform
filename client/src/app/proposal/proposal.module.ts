import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ListBrandComponent } from './list-brand/list-brand.component';
import { CreateComponent } from './create/create.component';
import { ViewProposalComponent } from './view-proposal/view-proposal.component';
import { ProposalRoutingModule } from './proposal-routing.module';
import { WidgetModule } from '../widgets/widget.module';
import { ContentProposalComponent } from './content-proposal/content-proposal.component';
import { ProposalPostsTabComponent } from './tabs/proposal-posts-tab/proposal-posts-tab.component';
import { ProposalAudienceTabComponent } from './tabs/proposal-audience-tab/proposal-audience-tab.component';
import { ProposalMetricsTabComponent } from './tabs/proposal-metrics-tab/proposal-metrics-tab.component';
import { ProposalPortfolioTabComponent } from './tabs/proposal-portfolio-tab/proposal-portfolio-tab.component';
import { InstaPostComponent } from './tabs/insta-post/insta-post.component';
import { CountryPipe } from '../shared/pipe/country.pipe';
import { InstaTabsComponent } from './insta-tabs/insta-tabs.component';
import { MetricsCardComponent } from './tabs/metrics-card/metrics-card.component';
import { AllowRebidComponent } from './allow-rebid/allow-rebid.component';

@NgModule({
  imports: [CommonModule, SharedModule, WidgetModule, ProposalRoutingModule],
  declarations: [
    ListBrandComponent,
    AllowRebidComponent,
    CreateComponent,
    ViewProposalComponent,
    ContentProposalComponent,
    InstaTabsComponent,
    ProposalPortfolioTabComponent,
    ProposalPostsTabComponent,
    ProposalAudienceTabComponent,
    ProposalMetricsTabComponent,
    InstaPostComponent,
    MetricsCardComponent,
  ],
  providers: [CountryPipe],
  exports: [MetricsCardComponent],
})
export class ProposalModule {}
