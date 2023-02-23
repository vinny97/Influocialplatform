import { Component, OnInit, ViewChild } from '@angular/core';
import { Step1Component } from '../step1/step1.component';
import { Step2Component } from '../step2/step2.component';
import { Step3Component } from '../step3/step3.component';

@Component({
  selector: 'app-create-layout',
  templateUrl: './create-layout.component.html',
  styleUrls: ['./create-layout.component.css'],
})
export class CreateLayoutComponent implements OnInit {
  @ViewChild(Step1Component) step1Component: Step1Component;
  @ViewChild(Step2Component) step2Component: Step2Component;
  @ViewChild(Step3Component) step3Component: Step3Component;
  step = 0;
  campaign = null;
  constructor() {}

  ngOnInit(): void {}
  get isType() {
    return this.step === 0;
  }

  onStepClick(step) {
    if (this.step > step) {
      this.step = step;
      // if(this.step === 1) {
      //   this.step1Component.form.patchValue(this.campaign);
      // } else if(this.step === 2) {
      //   this.step2Component.form.patchValue(this.campaign);
      // } else if(this.step === 3) {
      //   this.step3Component.form.patchValue(this.campaign);
      //   this.step3Component.isTarget = this.campaign.audience;
      // }
    }
  }

  onNext(campaign) {
    this.campaign = { ...this.campaign, ...campaign };
    this.step++;
  }
}
