import { Component, OnInit } from '@angular/core';
import { NgbCarouselConfig, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/@core';
import { Toast } from 'src/app/@helpers/SwalToast';
import { Router } from '@angular/router';
import { genders, countries, COUNTRIES, COMPANY_SIZE } from 'src/app/@constants';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [NgbCarouselConfig],
})
export class ProfileComponent implements OnInit {
  showNavigationArrows = false;
  showNavigationIndicators = false;
  images = [
    { url: 'assets/PIC.png' },
    { url: 'assets/PIC1.png' },
    { url: 'assets/PIC.png' },
  ];

  //  Constants
  company_size = COMPANY_SIZE;
  countries = COUNTRIES;
  genders = genders.slice(1, 3);

  todayDate = new Date(Date.now());
  minDate: NgbDateStruct = {
    year: this.todayDate.getFullYear() - 100,
    month: 1,
    day: 1,
  };
  maxDate: NgbDateStruct = {
    year: this.todayDate.getFullYear(),
    month: this.todayDate.getMonth() + 1,
    day: this.todayDate.getDate(),
  };

  user = null;
  form: FormGroup;
  isSubmit = false;
  isSubmit1 = false;
  step = 1;
  constructor(
    private fb: FormBuilder,
    private config: NgbCarouselConfig,
    private router: Router,
    private userService: UserService
  ) {
    // genders.shift();
    // customize default values of carousels used by this component tree
    this.config.showNavigationArrows = false;
    this.config.showNavigationIndicators = true;
  }
  ngOnInit(): void {
    this.create();
    this.user = this.userService.getCurrentUser();

    if (this.user && this.user.role == 2) {
      this.form.removeControl('companyName');
      this.form.removeControl('companySize');
      this.form.removeControl('role');
    } else if (this.user && (this.user.role == 3 || this.user.role === 4)) {
      this.form.removeControl('image');
      this.form.removeControl('dob');
      this.form.removeControl('gender');
    }
  }
  create() {
    this.form = this.fb.group({
      contact: ['', [Validators.required]],
      gender: [null, [Validators.required]],
      dob: ['', [Validators.required]],
      image: [''],
      isProfileComplete: [true],
      companyName: ['', [Validators.required]],
      companySize: [null, [Validators.required]],
      role: [3],
    });
  }

  get f() {
    return this.form.controls;
  }
  get address() {
    return (this.form.controls.address as FormGroup).controls;
  }
  onImageUpload(imageUrl) {
    this.f.image.setValue(imageUrl);
  }
  onNextClick() {
    this.isSubmit1 = true;
    if (this.form.invalid) {
      return;
    }
    this.form.addControl(
      'address',
      this.fb.group({
        postCode: ['', [Validators.required]],
        street: ['', [Validators.required]],
        city: ['', [Validators.required]],
        state: ['', [Validators.required]],
        country: [null, [Validators.required]],
      })
    );
    this.step = 2;
  }
  onSubmit() {
    this.isSubmit = true;
    if (this.form.invalid) {
      return;
    }
    this.userService.update(this.form.value).subscribe((res) => {
      if (res.status === 200) {
        console.log(res);
        Toast.fire({ title: 'Profile completed', icon: 'success' });
        localStorage.removeItem('sign-up');
        this.router.navigate(['auth/instagram', res.data.user._id]);
      }
    });
  }
}
