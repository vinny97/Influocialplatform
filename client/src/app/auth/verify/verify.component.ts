import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Location, PlatformLocation } from '@angular/common';
import { Subscription } from 'rxjs';
import { Toast } from 'src/app/@helpers/SwalToast';
import { UserService } from 'src/app/@core';
import { VerifyService } from '../verify.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css'],
})
export class VerifyComponent implements OnInit {
  sentTo = '';
  type = 0;
  otp = '';

  isResendLoading = false;
  error = null;
  isLoading = false;

  userVerifyService: Subscription = new Subscription();
  userVerifyResend: Subscription = new Subscription();
  userVerify: Subscription = new Subscription();
  url: string;

  constructor(
    private userService: UserService,
    private verifyService: VerifyService,
    private router: Router,
    private _location: PlatformLocation
  ) {}

  onOtpChange(otp: string) {
    console.log(otp);
    this.otp = otp;

    if (this.otp.length === 4) {
      this.onSubmit();
    }
  }
  ngOnInit(): void {
    this.userVerifyService = this.verifyService.currentValue.subscribe(
      (value) => {
        console.log(JSON.stringify(value));
        if (value !== '' && value !== null) {
          console.log('inside if');
          this.type = value.type;
          this.sentTo = value.sentTo;
        } else {
          console.log('inside else');

          this.router.navigate(['auth']);
        }
      }
    );
    // this.detectBa  ckButton();
  }

  // detectBackButton() {
  //   this.router.events.subscribe((event: NavigationStart) => {
  //     if (event.navigationTrigger === 'popstate') {
  //       console.log('Back button triggered');
  //       this.verifyService.set(null);
  //       this.router.navigate(['auth/sign-up']);
  //     }
  //   });
  // }
  onResendClick() {
    this.isResendLoading = true;

    this.userVerifyResend = this.userService
      .verifyResend({ email: this.sentTo })
      .subscribe(
        (res: any) => {
          if (res.status === 200) {
            this.isResendLoading = false;
            Toast.fire({ icon: 'success', title: 'OTP sent successfully' });

            Toast.fire({ icon: 'success', title: 'OTP sent successfully' });
          }
        },
        (err) => {}
      );
    // resend otp here
  }
  onSubmit() {
    if (this.otp.length < 4) {
      return;
    }
    this.isLoading = true;
    this.error = null;
    console.log('inside onSubmit');

    this.userVerify = this.userService
      .verify({ type: this.type, email: this.sentTo, otp: this.otp })
      .subscribe(
        (res: any) => {
          console.log(res);

          this.isLoading = false;

          if (res.status == 200) {
            if (this.type === 1) {
              this.userService.setAuth(res.data.user);
              this.router.navigate(['/auth/profile']);
            } else if (this.type === 2) {
              this.router.navigate(['/auth/reset-password']);
            } else if (this.type === 3) {
              this.router.navigate(['/discover']);
            }
          }
        },
        (err) => {
          if (err.status === 401 && err.code === 401.1) {
            this.error = err.message;
            this.isLoading = false;
          }
        }
      );
  }
  ngOnDestroy() {
    this.userVerifyService.unsubscribe();
    this.userVerifyResend.unsubscribe();
    this.userVerify.unsubscribe();
  }
}
