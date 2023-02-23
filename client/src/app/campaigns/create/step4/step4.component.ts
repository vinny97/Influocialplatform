import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BrandService } from './../../../@core/services/brand.service';
import { Toast } from 'src/app/@helpers/SwalToast';
import { CAMPAIGN_DURATION } from 'src/app/@constants';

@Component({
  selector: 'app-step4',
  templateUrl: './step4.component.html',
  styleUrls: ['./step4.component.css'],
})
export class Step4Component implements OnInit {
  todayDate: any = new Date();
  @Input() campaign = null;
  form: FormGroup;
  isSubmit = false;
  brandId = null;
  durations = CAMPAIGN_DURATION;

  campaignFormData: any = JSON.parse(
    localStorage.getItem('campaignData-step4')
  );

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private brandService: BrandService
  ) {
    this.route.params.subscribe((params) => {
      this.brandId = params['brandId'];
      console.log('params', params);
    });
  }

  ngOnInit(): void {
    this.create();
  }
  create() {
    console.log('this.campaign', this.campaign);
    this.form = this.fb.group({
      startDate: ['', [Validators.required]],
      duration: [10, [Validators.required]],
    });
    this.form.patchValue(this.campaignFormData);
  }
  get f() {
    return this.form.controls;
  }
  get isAudience() {
    return typeof this.campaign.audience === undefined ||
      this.campaign.audience == null
      ? false
      : true;
  }

  onSubmit() {
    console.log({ ...this.campaign, ...this.form.value });
    this.isSubmit = true;
    console.log(this.form.controls)
    if (this.form.invalid) {
      return;
    }
    this.brandService
      .postCampaignsByBrandId(this.brandId, {
        ...this.campaign,
        ...this.form.value,
      })
      .subscribe((res) => {
        if (res.status === 200) {
          console.log(res);

          Toast.fire({
            title: 'Campaign created successfully',
            icon: 'success',
          });
          this.removeLocalStorage();
          this.router.navigate(['../'], { relativeTo: this.route });
        }
      });
    localStorage.setItem(
      'campaignData-step4',
      JSON.stringify(this.campaignFormData)
    );
  }

  get durationDate() {
    if (this.f.startDate.value && this.f.duration.value) {
      let d = new Date(this.f.startDate.value);
      d.setDate(d.getDate() + this.f.duration.value);
      return d;
    }
    return null;
  }
  removeLocalStorage() {
    localStorage.removeItem('campaignData-step1');
    localStorage.removeItem('campaignData-step2');
    localStorage.removeItem('campaignData-step3');
    localStorage.removeItem('campaignData-step4');
  }
}
