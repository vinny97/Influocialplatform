import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
import { ProfileService } from 'src/app/@core/services/profile.service';
import { Toast } from 'src/app/@helpers/SwalToast';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit {
  public uploader: FileUploader = new FileUploader({
    url: `${environment.file_url}/api/upload/`,
  });

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private router: Router
  ) {}

  ngOnInit() {
    this.create();
    this.uploader.onAfterAddingFile = (file) => {
      file.onSuccess = (res: any) => {
        console.log(res);
        console.log(JSON.parse(res).url);
        this.form.patchValue({ image: JSON.parse(res).url });
        console.log(this.form.value);
        this.submit();
      };
    };
  }
  uploadImage() {
    if (this.form.invalid) {
      Swal.fire('Some fields are missing', '', 'error');
      return;
    }
    this.uploader.uploadAll();
  }
  create() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      image: ['', [Validators.required]],
      caption: ['', [Validators.required]],
      url: ['', [Validators.required]],
    });
  }
  fileChangeEvent(event) {
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
        this.form.patchValue({ image: reader.result });
        console.log(this.form.value);
      };
    }
  }

  submit() {
    if (this.form.invalid) {
      Swal.fire('Some fields are missing', '', 'error');
      return;
    }
    this.profileService
      .createPortfolio(this.form.value)
      .subscribe((response) => {
        console.log(response);
        if (response.status === 200) {
          Toast.fire({
            title: 'Portfolio created and added into the list',
            icon: 'success',
          });
          this.form.reset();
          this.router.navigate(['/profile/portfolio']);
        }
      });
  }

  get f() {
    return this.form.controls;
  }
}
