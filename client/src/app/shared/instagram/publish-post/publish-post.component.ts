import { InstagramComponent } from './../../../auth/instagram/instagram.component';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Cropper from 'cropperjs';
import { FileItem, FileUploader } from 'ng2-file-upload';
import {
  Dimensions,
  ImageCroppedEvent,
  ImageTransform,
} from 'ngx-image-cropper';
import {
  InstaService,
  ProposalService,
  SchedulerService,
  UserService,
} from 'src/app/@core';
import { Toast } from 'src/app/@helpers/SwalToast';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-publish-post',
  templateUrl: './publish-post.component.html',
  styleUrls: ['./publish-post.component.css'],
  providers: [InstagramComponent]
})
export class PublishPostComponent implements OnInit {
  @ViewChild('imageCropper') imageCropper: ElementRef<any>;
  public uploader: FileUploader = new FileUploader({
    url: `${environment.file_url}/api/upload`,
  });
  fileToBeUploaded: FileItem;

  cropperAspectRatio: any = 4 / 5;
  imageDestinition: string;
  cropper: Cropper;
  isUploaded = false;
  @Input() proposal = null;
  FILE_URL = environment.file_url;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  showCropper = false;
  containWithinAspectRatio = false;
  transform: ImageTransform = {};
  form: FormGroup;
  isSubmit = false;
  isLoader: boolean = false;
  image: string;
  containerID = null;
  pageId = null;
  longLiveToken = null;
  currntUser: any;
  fileName: any;
  constructor(
    private fb: FormBuilder,
    private proposalService: ProposalService,
    private instaService: InstaService,
    private instaComponent: InstagramComponent,
    private userService: UserService,
    private schedulerService: SchedulerService
  ) {
    this.create();
  }

  ngOnInit() {
    this.getCurrentUser();
    this.longLiveToken = this.instaComponent.returnLongLiveToken();
    console.log(this.proposal);
    if (
      this.proposal !== null &&
      this.proposal !== undefined &&
      this.proposal.contentStatus !== 4
    ) {
      this.fileName = `contentImage.jpg`;
      this.patchForm();
    } else {
      this.patchForm();

      Swal.fire('This content has already been posted', '', 'error');
    }
  }

  getCurrentUser() {
    this.userService.currentUser.subscribe((response) => {
      console.log(response);
      this.currntUser = response;
      this.pageId = response.instagram.pageId;
      this.longLiveToken = response.instagram.longLiveAccessToken;
    });
  }
  create() {
    this.form = this.fb.group({
      image: [null, [Validators.required]],
      caption: [null, [Validators.required]],
      postTime: [null, Validators.required],
    });
  }

  patchForm() {
    this.form.patchValue({
      image: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg',
      caption: this.proposal.contentCaption,
    });
  }

  onUploadImage(imgUrl) {
    console.log("Image URL", imgUrl);
    console.log(this.form.controls['image'].value);
    this.f.image.setValue(imgUrl);
  }

  onRemoveImage(img) {
    console.log(img);

    this.f.image.setValue('');
  }

  onSubmit() {
    console.log("Submitting post form");
    this.isSubmit = true;
    console.log(this.form.value);
    if (this.currntUser.instagram === null) {
      Swal.fire('You have not yet associate your Instagram', '', 'error');
      return;
    }
    this.form.removeControl('postTime');
    if (this.form.invalid) {
      return;
    }
    console.log(this.f.image.value);

    this.isLoader = true;
    console.log(this.uploader.queue)

    if (this.uploader.queue.length === 0) {
      console.log("Uploader Queue length is 0");
      this.form.patchValue({
        image:
          'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg',
      });
      // this.f.image.setValue(this.FILE_URL + '/' + this.f.image.value);
      console.log(this.f.image.value);
      console.log("Long live token=", this.instaComponent.returnLongLiveToken());

      this.instaService
        .postContainer(
          "12345678",
          this.f.image.value,
          encodeURIComponent(this.f.caption.value),
          this.instaComponent.returnLongLiveToken()
        )
        .subscribe(
          (res: any) => {
            console.log(res);
            this.isLoader = false;
            this.containerID = res.id;
            this.publish();
          },
          (err) => {
            this.isLoader = false;
            console.log(err);

            Toast.fire('error', err.error.error.error_user_title);
          }
        );
    }
    else {
      this.fileToBeUploaded.upload();

      this.uploader.onErrorItem = (item, response, status, headers) => {
        console.log(response);
      };
      this.uploader.onSuccessItem = (item, response, status, headers) => {
        console.log(response);
        let url = JSON.parse(response);
        console.log("URL-->", url, url.url);
        this.form.patchValue({
          image: url.url,
        });
        // this.f.image.setValue(this.FILE_URL + '/' + this.f.image.value);
        console.log(this.f.image.value);

        this.instaService
          .postContainer(
            this.pageId,
            this.f.image.value,
            encodeURIComponent(this.f.caption.value),
            this.longLiveToken
          )
          .subscribe(
            (res: any) => {
              console.log(res);
              this.isLoader = false;
              this.containerID = res.id;
              this.publish();
            },
            (err) => {
              this.isLoader = false;
              console.log(err);

              Toast.fire('error', err.error.error.error_user_title);
            }
          );
      };
    }
  }

  schedule() {
    console.log("Scheduling post...");
    console.log(this.form.value);
    const scheduledTime = new Date(this.f.postTime.value).setSeconds(0);
    // patching value to make the given time an absolutle time. i.e 23:12 would become 23:00
    this.form.patchValue({
      postTime: new Date(this.f.postTime.value.setSeconds(0)),
    });
    console.log(this.form.value);
    if (this.currntUser.instagram === null) {
      Swal.fire('You have not yet associate your Instagram', '', 'error');
      return;
    }

    if (new Date().setSeconds(0) > scheduledTime) {
      Swal.fire(
        'You cannot set past or current time to schedule any post',
        '',
        'error'
      );
      this.form.patchValue({
        postTime: null,
      });
      return;
    }
    if (this.form.invalid) {
      return;
    }
    if (this.uploader.queue.length === 0) {
      this.form.patchValue({ image: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg' });
      this.schedulerService
        .schedulePost({ ...this.form.value, campaign: this.proposal.campaign._id, proposal: this.proposal._id })
        .subscribe((response) => {
          if (response.status === 200) {
            Swal.fire('Post Scheduled', '', 'success');
            this.form.reset();
            this.croppedImage = null;
          }
          (err) => {
            console.log(err);
            Swal.fire(`${err.message}`, '', 'error');
          };
        });
    }
    else {
      this.fileToBeUploaded.upload();
      this.uploader.onErrorItem = (item, response, status, headers) => {
        console.log(response);
      };
      this.uploader.onSuccessItem = (item, response, status, headers) => {
        console.log(response);
        this.form.patchValue({ image: JSON.parse(response).url });
        this.schedulerService
          .schedulePost({ ...this.form.value, campaign: this.proposal != null ? this.proposal.campaign._id : null })
          .subscribe((response) => {
            if (response.status === 200) {
              Swal.fire('Post Scheduled', '', 'success');
              this.form.reset();
              this.croppedImage = null;
            }
            (err) => {
              console.log(err);
              Swal.fire(`${err.message}`, '', 'error');
            };
          });
      };
    }
  }
  publish() {
    this.isLoader = true;
    this.instaService
      .publishPost(this.pageId, this.containerID, this.longLiveToken)
      .subscribe((res: any) => {
        this.isLoader = false;
        this.isSubmit = false;
        this.form.reset();
        Toast.fire('success', 'Published on Instagram');
        this.updateProposal(res.id);
        console.log(res);
      });
  }
  updateProposal(contenPublish) {
    this.proposalService
      .updateProposal(this.proposal._id, {
        contentPublishID: contenPublish,
        status: 4,
        contentStatus: 4,
      })
      .subscribe((response) => {
        if (response.status === 200) {
          console.log(response);

          Toast.fire('success', 'Posted!');
        }
      });
  }

  uploadFile(event) {
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
        this.isUploaded = true;
        console.log(this.form.value);
      };

      // ChangeDetectorRef since file is loading outside the zone
    }
  }

  fileChangeEvent(event: any): void {
    this.form.patchValue({ image: event.target.files[0] });
    this.imageChangedEvent = event;
    this.fileName = event.target.files[0].name;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    let date: number = new Date().getTime();

    // contents must be an array of strings, each representing a line in the new file
    let file = new File([this.dataURItoBlob(event.base64)], this.fileName, {
      type: 'image/jpg',
    });
    this.fileToBeUploaded = new FileItem(this.uploader, file, {});
    // (Visual Only) adds the new fileItem to the upload queue
    this.uploader.queue.push(this.fileToBeUploaded);
    // Start the actual file upload
  }

  imageLoaded() {
    this.showCropper = true;
    console.log('Image loaded');
  }
  removePicture() {
    this.croppedImage = null;
    this.imageChangedEvent = null;
    this.f.image.reset();
  }
  cropperReady(sourceImageDimensions: Dimensions) {
    console.log('Cropper ready', sourceImageDimensions);
  }

  loadImageFailed() {
    console.log('Load failed');
  }

  rotateLeft() {
    this.canvasRotation--;
    this.flipAfterRotate();
  }

  rotateRight() {
    this.canvasRotation++;
    this.flipAfterRotate();
  }

  private flipAfterRotate() {
    const flippedH = this.transform.flipH;
    const flippedV = this.transform.flipV;
    this.transform = {
      ...this.transform,
      flipH: flippedV,
      flipV: flippedH,
    };
  }

  flipHorizontal() {
    this.transform = {
      ...this.transform,
      flipH: !this.transform.flipH,
    };
  }

  flipVertical() {
    this.transform = {
      ...this.transform,
      flipV: !this.transform.flipV,
    };
  }

  resetImage() {
    this.scale = 1;
    this.rotation = 0;
    this.canvasRotation = 0;
    this.transform = {};
  }

  zoomOut() {
    this.scale -= 0.1;
    this.transform = {
      ...this.transform,
      scale: this.scale,
    };
  }

  zoomIn() {
    this.scale += 0.1;
    this.transform = {
      ...this.transform,
      scale: this.scale,
    };
  }

  toggleContainWithinAspectRatio() {
    this.containWithinAspectRatio = !this.containWithinAspectRatio;
  }

  updateRotation() {
    this.transform = {
      ...this.transform,
      rotate: this.rotation,
    };
  }
  dataURItoBlob(dataURI): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    console.log('mimeString', mimeString);
    const ab = new ArrayBuffer(byteString.length);
    let ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const file = new Blob([ab], { type: 'image/jpg' });
    console.log('dataURItoBlob', file);
    return new Blob([ab], { type: 'image/jpg' });
  }

  get f() {
    return this.form.controls;
  }
}
