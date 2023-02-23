import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProposalService } from 'src/app/@core';
import { Toast } from 'src/app/@helpers/SwalToast';
import { UnlinkService } from 'src/app/@core/services/unlink.service';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-submit',
  templateUrl: './submit.component.html',
  styleUrls: ['./submit.component.css'],
})
export class SubmitComponent implements OnInit {
  public uploader: FileUploader = new FileUploader({
    url: `${environment.file_url}/api/upload`,
  });
  proposalID: any = null;
  result = null;
  url = '';

  isSubmitContent: boolean = false;
  isEdit: boolean = false;
  isOutRight: boolean = false;
  image: any;
  form: FormGroup;
  isSubmit = false;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private proposalService: ProposalService,
    private router: Router,
    private unlinkService: UnlinkService,
    private _location: Location
  ) {
    this.router.events.subscribe((evt) => {
      this.url = this.router.url.split('/')[2];
      console.log(this.url);

      if (this.url === 'edit-submission') {
        this.isEdit = true;
      } else if (this.url === 'outright') {
        this.isOutRight = true;
      } else {
        this.isSubmitContent = true;
      }
    });
  }

  ngOnInit(): void {
    this.create();

    this.route.params.subscribe((params) => {
      this.proposalID = params['proposalID'];
      if (this.proposalID) {
        this.getData();
      }
    });
    console.log(this.form.value);
  }

  create() {
    this.form = this.fb.group({
      contentPost: [[], [Validators.required]],
      contentCaption: [null, [Validators.required]],
      contentStatus: [null, [Validators.required]],
      outrightFee: [null, [Validators.required]],
      outrightStatus: [null, [Validators.required]],
    });
  }

  onUploadImage(imgUrl) {
    console.log(imgUrl)
    console.log(this.form.controls)
    this.form.patchValue({ contentPost: [] });
    console.log(this.f.contentPost.value);

    this.f.contentPost.setValue([...this.f.contentPost.value, imgUrl]);
    console.log(this.f.contentPost.value);
  }

  getData() {
    this.proposalService.getProposal(this.proposalID).subscribe((res) => {
      // console.log(res);
      if (res.status === 200) {
        this.result = res.data.proposal;
        if (this.isEdit && this.result) {
          this.form.patchValue(this.result);
        } else if (this.isOutRight && this.result) {
          this.form.patchValue(this.result);
        }
      } else {
        this.result = null;
      }
    });
  }

  onSubmit() {
    console.log(this.form.value)
    if (this.isEdit) {
      console.log('Iniside isEdit');

      this.form.removeControl('outrightFee');
      this.form.removeControl('outrightStatus');
      this.f.contentStatus.setValue(2);
    } else if (this.isOutRight) {
      console.log('Iniside isOutRight');

      this.form.removeControl('contentPost');
      this.form.removeControl('contentCaption');
      this.form.removeControl('contentStatus');
      this.f.outrightStatus.setValue(2);
    } else if (this.isSubmitContent) {
      console.log('inside isSubmitContent');

      this.form.removeControl('outrightFee');
      this.form.removeControl('outrightStatus');
      this.f.contentStatus.setValue(1);
    } else {
      console.log('Iniside isOutRight 2');

      this.form.removeControl('outrightFee');
      this.form.removeControl('outrightStatus');
      this.f.contentStatus.setValue(2);
    }
    this.isSubmit = true;
    if (this.form.invalid) {
      console.log('empty form');
      return;
    }
    this.proposalService
      .updateProposal(this.proposalID, this.form.value)
      .subscribe((res) => {
        console.log(res);
        if (res.status === 200) {
          if (this.isEdit) {
            console.log('insde editing');
            this.router.navigate(['capture', this.proposalID]);
          } else if (this.isSubmitContent) {
            console.log('isSubmitContent');
            Toast.fire({
              title: 'Content submitted successfully',
              icon: 'success',
            });
            this.getData();
            this.router.navigate(['collabs/list/1']);
          } else if (this.isOutRight) {
            Toast.fire({ title: 'Bid Sent successfully', icon: 'success' });
            this.getData();
          }
        }
      });
  }

  removeImage() {
    this.form.patchValue({ contentPost: null });
  }
  onRemoveImage(img) {
    this.f.contentPost.setValue([
      ...this.f.contentPost.value.filter((e) => e !== img),
    ]);
    console.log(this.f.contentPost.value);
  }

 
  onFileChange(event) {
    console.log(event);
    console.log(event.target.files[0]);
    console.log(event);
    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];
    console.log(file);

    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);
      console.log(reader);
      console.log(reader);
      // When file uploads set it to file formcontrol
      reader.onload = () => {
        this.form.patchValue({ contentPost: reader.result });
        console.log(this.form.value);
        console.log(this.f.contentPost.value);
      };
    }
  }
  get f() {
    return this.form.controls;
  }
}
