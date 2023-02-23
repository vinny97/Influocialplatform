import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/@core';
import { UserType } from 'src/app/@models';
import { VerifyService } from '../verify.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers: [NgbCarouselConfig],
})
export class SignupComponent implements OnInit {
  UserType = UserType;
  showNavigationArrows = false;
  showNavigationIndicators = false;
  // images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);
  images = [
    { url: 'assets/PIC.png' },
    { url: 'assets/PIC1.png' },
    { url: 'assets/PIC.png' },
  ];
  formData: string;
  constructor(
    config: NgbCarouselConfig,
    public fb: FormBuilder,
    private userService: UserService,
    private verifyService: VerifyService,
    private router: Router
  ) {
    // customize default values of carousels used by this component tree
    config.showNavigationArrows = false;
    config.showNavigationIndicators = true;
  }
  form: FormGroup = null;
  isSubmit = false;
  ngOnInit(): void {
    this.create();
    console.log(localStorage.getItem('sign-up'));
    this.form.patchValue(JSON.parse(localStorage.getItem('sign-up')));
  }
  create() {
    this.form = this.fb.group({
      role: [UserType.influencer, Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  get f() {
    return this.form.controls;
  }
  get role() {
    return this.f.role.value;
  }
  onRoleClick() {
    this.f.role.patchValue(
      this.role === UserType.influencer ? UserType.brand : UserType.influencer
    );
  }
  onSubmit() {
    this.isSubmit = true;
    if (this.form.invalid) {
      return;
    }
    console.log("Form valid:", this.form.value);
    this.userService.signUp(this.form.value).subscribe(
      (res: any) => {
        console.log("Signup response:", res);
        if (res.status === 200) {
          console.log('Your OTP is', res.data.otp);
          this.verifyService.set({ type: 1, sentTo: this.f.email.value });
          console.log(this.form.value);
          localStorage.setItem('sign-up', JSON.stringify(this.form.value));
          this.router.navigate(['auth/verify']);
        }
      },
      (err) => {
        if (err && err.code === 422.1) {
          this.f.email.setErrors({ emailAlreadyRegistered: err.message });
        }
      }
    );
  }
}
