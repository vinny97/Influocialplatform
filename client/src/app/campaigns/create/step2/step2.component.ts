import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SOCIAL_MEDIA_CHANNELS } from 'src/app/@constants';
import { Toast } from 'src/app/@helpers/SwalToast';

@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.css'],
})
export class Step2Component implements OnInit {
  @Output() next = new EventEmitter();
  @Input() campaign = null;

  isEmptyHelpfulNote: boolean = false;
  isEmptyAvoidNote: boolean = false;

  SOCIAL_MEDIAS = SOCIAL_MEDIA_CHANNELS;

  helpInput = '';
  avoidInput = '';
  tagInput = '';
  handleInput = '';

  form: FormGroup;
  isSubmit = false;

  campaignFormData: any = JSON.parse(
    localStorage.getItem('campaignData-step2')
  );

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.create();
    console.log(this.form.controls['visionImages'].value.length);

    console.log(this.campaign.type);

    if (this.campaign && this.campaign.type === 2) {
      this.form.removeControl('description');
    } else if (this.campaign && this.campaign.type === 1) {
      this.form.removeControl('brief');
    }
  }
  create() {
    this.form = this.fb.group({
      visionImages: [[], [Validators.required]],
      description: ['', [Validators.required]],
      brief: ['', [Validators.required]],
      CFA: ['', [Validators.required]],
      help: [[]],
      avoid: [[]],
      socialMediaChannel: [null, [Validators.required]],
      channels: this.fb.group({
        postType: [''],
        tags: [[]],
        handles: [[]],
        caption: [''],
      }),
    });
    this.form.patchValue(this.campaignFormData);
  }
  get f() {
    return this.form.controls;
  }
  get channels() {
    return (this.form.controls.channels as FormGroup).controls;
  }
  onUploadImage(imgUrl) {
    console.log(imgUrl);
    console.table(imgUrl);
    this.f.visionImages.setValue([...this.f.visionImages.value, imgUrl]);
  }
  onRemoveImage(imgIndex) {
    this.f.visionImages.setValue(
      this.f.visionImages.value.filter((img, index) => index !== imgIndex)
    );
  }
  onAddHelp() {
    if (!this.helpInput || this.helpInput === ' ') {
      this.isEmptyHelpfulNote = true;
      return;
    }
    this.f.help.setValue([...this.f.help.value, this.helpInput]);
    this.helpInput = '';
    this.isEmptyHelpfulNote = false;
  }
  onRemoveHelp(index) {
    const a = this.f.help.value;
    a.splice(index, 1);
    this.f.visionImages.setValue([...a]);
  }
  onAddAvoid() {
    if (!this.avoidInput || this.avoidInput === ' ') {
      this.isEmptyAvoidNote = true;
      return;
    }
    this.f.avoid.setValue([...this.f.avoid.value, this.avoidInput]);
    this.avoidInput = '';
    this.isEmptyAvoidNote = false;
  }
  onRemoveAvoid(index) {
    const a = this.f.avoid.value;
    a.splice(index, 1);
    this.f.avoid.setValue([...a]);
  }
  onSubmit() {
    this.isSubmit = true;
    if (this.form.invalid) {
      console.log('Step-2 Invalid', this.form.value, this.form.errors);
      return;
    }
    this.next.emit(this.form.value);
    localStorage.setItem('campaignData-step2', JSON.stringify(this.form.value));
  }
  campaignData(campaignData: any): string {
    throw new Error('Method not implemented.');
  }

  onAddTag() {
    if (!this.tagInput || this.tagInput === ' ') {
      return;
    }
    this.channels.tags.setValue([...this.channels.tags.value, this.tagInput]);
    this.tagInput = '';
  }

  onRemoveTag(index) {
    const a = this.channels.tags.value;
    a.splice(index, 1);
    this.channels.tags.setValue([...a]);
  }

  onAddHandle() {
    if (!this.handleInput || this.handleInput === ' ') {
      return;
    }
    this.channels.handles.setValue([
      ...this.channels.handles.value,
      this.handleInput,
    ]);
    this.handleInput = '';
  }

  onRemoveHandle(index) {
    const a = this.channels.handles.value;
    a.splice(index, 1);
    this.channels.handles.setValue([...a]);
  }

  selectSocialMedia(id: number) {
    this.f.socialMediaChannel.setValue(id);
  }
}
