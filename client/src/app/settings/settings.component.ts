import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SettingsService } from '../@core/services/settings.service';
import { Toast } from '../@helpers/SwalToast';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  form: FormGroup;
  isLoader: boolean = false;
  constructor(
    private fb: FormBuilder,
    private settingsService: SettingsService
  ) {}

  ngOnInit() {
    this.create();
    this.getSettings();
  }

  create() {
    this.form = this.fb.group({
      paypalClientID: ['', Validators.required],
    });
  }
  getSettings() {
    this.isLoader = true;
    this.settingsService.getSettings().subscribe((response) => {
      if (response.status === 200) {
        this.form.patchValue(response.data);
        this.isLoader = false;
      }
    });
  }
  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    this.settingsService
      .updateSettings(this.form.value)
      .subscribe((response) => {
        console.log(response);
        if (response.status === 200) {
          Toast.fire({ icon: 'success', title: 'Settings Updated!' });
        }
      });
  }
}
