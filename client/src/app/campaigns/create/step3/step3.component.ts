import { Options } from '@angular-slider/ngx-slider';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { COUNTRIES, genders } from 'src/app/@constants';

@Component({
  selector: 'app-step3',
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.css'],
})
export class Step3Component implements OnInit {
  @Output() next = new EventEmitter();

  hello = ['hi', 'bye'];

  value: number = 40;
  highValue: number = 60;
  options: Options = {
    floor: 0,
    ceil: 100,
  };

  valueloc: number = 40;
  highValueloc: number = 60;
  optionsloc: Options = {
    floor: 2,
    ceil: 100,
  };

  age: number = 10;
  ageValue: number = 60;
  ageoptions: Options = {
    floor: 0,
    ceil: 100,
  };

  isTarget = false;
  genders = genders;
  countries = COUNTRIES;

  form: FormGroup;
  isSubmit = false;

  campaignFormData: any = JSON.parse(
    localStorage.getItem('campaignData-step3')
  );

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.create();
  }
  create() {
    this.form = this.fb.group({
      budget: ['', [Validators.required]],
      cost: ['', [Validators.required]],
      isTargetAudience: [false],
      influencer: this.fb.group({
        gender: [0],
        followers: [''],
        age: [''],
        location: [[]],
      }),
    });
    this.form.patchValue(this.campaignFormData);
  }
  get f() {
    return this.form.controls;
  }
  get influencer() {
    return (this.f.influencer as FormGroup).controls;
  }
  onInfluencerGenderClick(genderId) {
    this.influencer.gender.setValue(genderId);
  }

  get audience() {
    return (this.f.audience as FormGroup).controls;
  }
  onAudienceGenderClick(genderId) {
    this.audience.gender.setValue(genderId);
  }
  onTargetYes(value) {
    this.isTarget = value;
    this.f.isTargetAudience.setValue(true);
    this.form.addControl(
      'audience',
      this.fb.group({
        gender: [0],
        target: [''],
        location: [null],
        description: ['']
      })
    );
  }
  onTargetNo(value) {
    this.f.isTargetAudience.setValue(false);
    this.isTarget = !value;
  }
  onSubmit() {
    console.log(this.form.value)
    this.isSubmit = true;
    if (this.form.invalid) {
      return;
    }
    this.next.emit(this.form.value);
    localStorage.setItem('campaignData-step3', JSON.stringify(this.form.value));
  }
}
