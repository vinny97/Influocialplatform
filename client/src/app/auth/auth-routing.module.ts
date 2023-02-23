import { ResetComponent } from './reset/reset.component';
import { ForgetComponent } from './forget/forget.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { VerifyComponent } from './verify/verify.component';
import { AuthGuard, NoAuthGuard } from '../@core';
import { InstagramComponent } from './instagram/instagram.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'sign-up', component: SignupComponent },
  { path: 'verify', component: VerifyComponent },
  { path: 'forget', component: ForgetComponent },
  {
    path: 'reset-password',
    component: ResetComponent,
  },
  { path: 'profile', component: ProfileComponent },
  {
    path: 'instagram/:userID',
    component: InstagramComponent,
  },
  {
    path: 'instagram',
    component: InstagramComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
