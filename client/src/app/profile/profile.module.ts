import { ReactiveFormsModule } from '@angular/forms';
import { NgxPermissionsModule } from 'ngx-permissions';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { CreateComponent } from './portfolio/create/create.component';
import { ViewComponent } from './portfolio/view/view.component';

@NgModule({
  declarations: [
    ProfileComponent,
    PortfolioComponent,
    CreateComponent,
    ViewComponent
  ],
  imports: [CommonModule, ProfileRoutingModule, SharedModule, ReactiveFormsModule],

  exports: [NgxPermissionsModule]
})
export class ProfileModule { }
