import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { SharedModule } from '../shared/shared.module';
import { VerifyComponent } from './verify/verify.component';
import { NgOtpInputModule } from 'ng-otp-input';
import { VerifyService } from './verify.service';
import { ProfileComponent } from './profile/profile.component';
import { ForgetComponent } from './forget/forget.component';
import { ResetComponent } from './reset/reset.component';
import { InstagramComponent } from './instagram/instagram.component';

@NgModule({
  declarations: [
    SignupComponent,
    InstagramComponent,
    LoginComponent,
    VerifyComponent,
    ProfileComponent,
    ForgetComponent,
    ResetComponent,
  ],
  imports: [CommonModule, AuthRoutingModule, SharedModule, NgOtpInputModule],
  providers: [VerifyService],
})
export class AuthModule {}
