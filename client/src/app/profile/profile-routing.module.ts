import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewComponent } from './portfolio/view/view.component';
import { CreateComponent } from './portfolio/create/create.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { ProfileComponent } from './profile.component';

const routes: Routes = [
  { path: '', component: ProfileComponent },
  { path: 'portfolio', component: PortfolioComponent },
  { path: 'portfolio/create', component: CreateComponent },
  { path: 'portfolio/view', component: ViewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
