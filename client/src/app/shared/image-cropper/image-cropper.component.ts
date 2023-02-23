import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import {
  Dimensions,
  ImageCroppedEvent,
  ImageTransform,
} from 'ngx-image-cropper';
@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.css'],
})
export class NGXImageCropperComponent implements OnInit, OnDestroy {
  @Input() aspectRatio: any;
  @Input() isRound: any;
  newImage = false;
  currentPicture!: string;
  isChanged = false;
  option: NgbModalOptions = {
    beforeDismiss: () => {
      this,
        this.cropped.emit(
          this.isChanged ? this.croppedImage : this.currentPicture
        );
      return true;
    },
  };

  imageChangedEvent: any = '';
  croppedImage: any = '';
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  showCropper = false;
  containWithinAspectRatio = false;
  transform: ImageTransform = {};
  @Output() cropped = new EventEmitter();
  @Output() onSetImageClicked = new EventEmitter();

  @ViewChild('content') content: TemplateRef<any>;
  fileName: any;
  base64ToImageFile: File;
  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {
    console.log(typeof this.isRound);
  }
  ngAfterContentInit() {}
  open(image: any) {
    this.currentPicture = image;
    this.modalService.open(this.content, this.option);
  }
  close() {
    console.log('emitted ImageFile', this.base64ToImageFile);
    this.onSetImageClicked.emit(this.base64ToImageFile);
    this.isChanged = true;
    this.modalService.dismissAll();
  }

  fileChangeEvent(event: any): void {
    this.fileName = event.target.files[0].name;
    console.log(event);
    this.imageChangedEvent = event;
    this.newImage = true;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.cropped.emit(this.croppedImage);
    this.croppedImage = event.base64;
    console.log(event);
    const fileToReturn = this.base64ToFile(event.base64, this.fileName);

    return fileToReturn;
  }

  imageLoaded() {
    this.showCropper = true;
  }

  cropperReady(sourceImageDimensions: Dimensions) {}

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
  ngOnDestroy() {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    console.log(this.isChanged ? this.croppedImage : this.currentPicture);

    this.cropped.emit(this.isChanged ? this.croppedImage : this.currentPicture);
  }
  base64ToFile(data, filename) {
    const arr = data.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    this.base64ToImageFile = new File([u8arr], filename, { type: mime });
    return new File([u8arr], filename, { type: mime });
  }
}
