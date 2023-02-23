import { Component, OnInit } from '@angular/core';
import { InstagramService, UserService } from 'src/app/@core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { genders, countries, COMPANY_SIZE } from 'src/app/@constants';
import { Toast } from 'src/app/@helpers/SwalToast';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-date-struct';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  form: FormGroup;
  isSubmit = false;

  showInstagramData: boolean = false;

  company_size = COMPANY_SIZE;
  countries = countries;
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
  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private instagramService: InstagramService
  ) {
    genders.shift();
  }

  ngOnInit(): void {
    this.create();
    this.get();
  }
  get() {
    this.userService.getProfile().subscribe((res) => {
      console.log(res);

      let role = res.data.user.role;
      this.form.patchValue(res.data.user);
      if (this.instagram.userName.value) {
        this.showInstagramData = true;
      }

      if (role === 3 || role === 4) {
        this.form.removeControl('image');
        this.form.removeControl('dob');
        this.form.removeControl('gender');
        this.form.removeControl('instagram');
      } else if (role === 2) {
        this.form.removeControl('companyName');
        this.form.removeControl('companySize');
      }
    });
  }
  create() {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      role: ['', Validators.required],
      contact: ['', [Validators.required]],
      gender: [null, [Validators.required]],
      dob: ['', [Validators.required]],
      image: [''],
      companyName: ['', [Validators.required]],
      companySize: ['', [Validators.required]],
      address: this.fb.group({
        postCode: ['', [Validators.required]],
        street: ['', [Validators.required]],
        city: ['', [Validators.required]],
        state: ['', [Validators.required]],
        country: ['', [Validators.required]],
      }),

      instagram: this.fb.group({
        instagramID: [''],
        userName: ['', [Validators.required]],
      }),
    });
  }
  get f() {
    return this.form.controls;
  }
  get address() {
    return (this.form.controls.address as FormGroup).controls;
  }

  get instagram() {
    return (this.form.controls.instagram as FormGroup).controls;
  }

  onImageUpload(imageUrl) {
    this.f.image.setValue(imageUrl);
  }
  onSubmit() {
    console.log("Trying to update profile.");
    this.isSubmit = true;
    console.log("Profile update object", this.form.value);
    // if (this.form.invalid) {
    //   return;
    // }
    this.showInstagramData = true;
    this.userService.update(this.form.value).subscribe((res) => {
      if (res.status === 200) {
        Toast.fire({ title: 'Profile completed', icon: 'success' });
      }
    });
  }

  linkFB() {
    this.instagramService.facebookLogin();
    // appInitializer(this.accountService);
  }

  // logoutFB() {
  //   this.instagramService.logout();
  // }
}
