import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-image-preview',
  templateUrl: './image-preview.component.html',
  styleUrls: ['./image-preview.component.css'],
})
export class ImagePreviewComponent implements OnInit {
  @ViewChild('fileInput') el: ElementRef;
  @Input() uploadButtonHeight: any;
  isUploaded = false;
  imageURL: any;
  file: any;
  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {}

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
        console.log(reader.result);
        this.isUploaded = true;
        this.imageURL = reader.result;
      };

      // ChangeDetectorRef since file is loading outside the zone
      this.cd.markForCheck();
    }
  }

  removePicture() {
    this.isUploaded = false;

    this.imageURL = null;
  }
}
