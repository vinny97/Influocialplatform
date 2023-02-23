import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  Input,
} from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { UnlinkService } from 'src/app/@core/services/unlink.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css'],
})
export class UploadFileComponent implements OnInit {
  public uploader: FileUploader = new FileUploader({
    url: `${environment.file_url}/api/upload`,
  });

  @ViewChild('input') input!: ElementRef;

  @Output() upload = new EventEmitter<string>();

  @Output() remove = new EventEmitter<string>();

  @Input() accept = 'image/*';

  constructor(private unlinkService: UnlinkService) {}

  ngOnInit(): void {
    console.log(this.uploader);
    this.setUploader();
  }
  setUploader() {
    console.log(this.uploader);

    this.uploader.onAfterAddingFile = (file) => {
      file.onSuccess = (res: any) => {
        console.log(res);
        console.log(JSON.parse(res).url);
        this.upload.emit(JSON.parse(res).url);
      };
    };
  }

  onFileClick(event) {
    console.log(event);
    event.target.value = '';
  }

  removeImage(img) {
    this.unlinkService.delete(img).subscribe((res) => {
      if (+res.status === 200) {
        this.uploader.queue = [];
        this.remove.emit(img);
      }
    });
  }

  click() {
    this.input.nativeElement.click();
  }
}
