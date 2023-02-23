import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { CAMPAIGN_CATEGORIES, objectives } from 'src/app/@constants';

@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.css'],
})
export class Step1Component implements OnInit {
  @Output() next = new EventEmitter();
  @Input() campaign = null;

  objectives = objectives;
  categories = CAMPAIGN_CATEGORIES;

  form: FormGroup;
  isSubmit = false;

  campaignFormData: any = JSON.parse(
    localStorage.getItem('campaignData-step1')
  );
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.create();
    // console.log('this.campaign', this.campaign)
    if (this.campaign && this.campaign.type === 2) {
      this.form.removeControl('isPhysicalProduct');
      this.form.removeControl('physicalOption');
    }
  }
  create() {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      image: [''.replace(/\s/g, ''), [Validators.required]],
      isPhysicalProduct: [false, [Validators.required]],
      physicalOption: [1],
      objective: [null, [Validators.required]],
      service: ['', [Validators.required]],
      category: [null, [Validators.required]],
    });
    this.form.patchValue(this.campaignFormData);
  }
  get f() {
    return this.form.controls;
  }
  onYesClick(value) {
    console.log('onYesClick', value);
    this.f.isPhysicalProduct.setValue(value ? true : false);
  }
  onNoClick(value) {
    console.log('onNoClick', value);
    this.f.isPhysicalProduct.setValue(value ? false : true);
  }
  onObjectiveClick(objectiveId) {
    this.f.objective.setValue(objectiveId);
  }

  onSubmit() {
    this.isSubmit = true;
    if (this.form.invalid) {
      return;
    }
    this.next.emit(this.form.value);
    localStorage.setItem('campaignData-step1', JSON.stringify(this.form.value));
  }
}
