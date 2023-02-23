import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { FacebookService, LoginOptions, LoginResponse } from 'ngx-facebook';
import { InstaService, UserService } from 'src/app/@core';
import { InstagramService } from 'src/app/@core/services/instagram.service';
import { Toast } from 'src/app/@helpers/SwalToast';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-instagram',
  templateUrl: './instagram.component.html',
  styleUrls: ['./instagram.component.css'],
  providers: [NgbCarouselConfig],
})
export class InstagramComponent implements OnInit {
  user = null;
  form: FormGroup;
  isSubmit = false;
  isLoader = false;
  userID: any;
  previousUrl: string;
  result: any;
  error: string = null;
  hideBtnsAndInstructions = false;
  accessToken: string;
  pages: any;
  longLiveToken: any;
  instagram_business_account: any;
  pageProfileInfo: any[] = [];

  constructor(
    private fb: FormBuilder,
    private config: NgbCarouselConfig,
    private router: Router,
    private route: ActivatedRoute,
    private instagramService: InstagramService,
    private instaService: InstaService,
    private facebook: FacebookService,
    private userService: UserService
  ) {
    // genders.shift();
    // customize default values of carousels used by this component tree
    this.config.showNavigationArrows = false;
    this.config.showNavigationIndicators = true;
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      console.log("Social->", params);
      this.userID = params['userID'];
      if (this.userID) {
        console.log(this.userID);
        this.create();
      }
    });
    console.log(this.pageProfileInfo);
  }

  create() {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      isAutoLogin: [false],
    });
  }

  onSubmit() {
    this.isLoader = true;
    this.isSubmit = true;
    if (this.form.invalid) {
      return;
    }
    this.instagramService.login(this.form.value, this.userID).subscribe(
      (response) => {
        console.log(response);
        if (response.status === 200) {
          this.isLoader = false;

          this.router.navigate(['discover']);
          Toast.fire({
            title: 'Succesfully logged in to instagram',
            icon: 'success',
          });
        } else {
          this.isLoader = false;

          Toast.fire({
            title: 'Something went wrong',
            icon: 'error',
          });
        }
      },
      (error) => {
        this.isLoader = false;
        console.log(error);
        console.log(error.message);
        this.error = error.message;
      }
    );
  }

  returnLongLiveToken(){
    return this.longLiveToken;
  }

  loginWithFacebook() {
    this.instaService.loginWithFacebook().then((response) => {
      if (response.status === 'connected') {
        console.log(response);
        this.accessToken = response.authResponse.accessToken;
        console.log(this.accessToken);
        if (this.accessToken) {
          this.instaService
            .getLongTermAccessToken(this.accessToken)
            .subscribe((response) => {
              console.log("Long term access token:-",response);
              // this.instaService.longLiveToken = response.access_token;
              this.longLiveToken = response.access_token;
              //now get the User profile information i.e description, profile name

              this.getUserProfile(this.longLiveToken);
            });
        } else {
          Toast.fire({
            title: 'Unable to get access token',
            icon: 'error',
          });
        }
      }
    });
  }

  getUserProfile(longLiveAccessToken) {
    console.log('1');
    this.instaService.getUsersProfile(longLiveAccessToken).subscribe(
      (response) => {
        console.log(response);
        this.pages = response.data;
        //now get the business pages associated with that profile
        if (this.pages) {
          this.pages.forEach((page) => {
            this.getUsersBusinessPages(page.id, longLiveAccessToken);
          });
        }
      },
      (err) => {
        this.error = err.error.error.message;
      }
    );
  }
  getUsersBusinessPages(profileID, longLiveAccessToken) {
    console.log('2');

    this.instaService
      .getUsersBusinessPages(profileID, longLiveAccessToken)
      .subscribe((response) => {
        console.log(response);

        //get page id
        this.instagram_business_account =
          response?.instagram_business_account?.id;
        if (this.instagram_business_account) {
          //get page profile information
          this.getBusinessPageInfo(
            this.instagram_business_account,
            longLiveAccessToken
          );
        }
      });
  }
  getBusinessPageInfo(businessPageID, longLiveAccessToken) {
    console.log('3');

    this.instaService
      .getBusinessPageInfo(businessPageID, longLiveAccessToken)
      .subscribe((response) => {
        console.log(response);
        console.log(this.pageProfileInfo);
        this.hideBtnsAndInstructions = true;

        this.pageProfileInfo.push(response);
      });
  }

  proceedWithSelectedPage(page) {
    const profileInfoAndToken = {
      profileInfo: page,
      longLiveAccessToken: this.longLiveToken,
      pageId: page?.id,
    };
    this.userService
      .updateInstagramInfo(this.userID, profileInfoAndToken)
      .subscribe((response) => {
        console.log(response);
        if (response.status === 200) {
          Toast.fire({
            title: 'Succesfully logged in to instagram',
            icon: 'success',
          });
          this.router.navigate(['/discover']);
        }
      });
  }
}
