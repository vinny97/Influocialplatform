import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { InstagramService } from 'src/app/@core/services/instagram.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-measure-post-card',
  templateUrl: './measure-post-card.component.html',
  styleUrls: ['./measure-post-card.component.css']
})
export class MeasurePostCardComponent implements OnInit {

  @Input() proposal: any = null;
  @Input() username: string = null;
  @Input() mediaID: string = null;
  @Input() isView: boolean = true;

  @Output() mediaInfoDone = new EventEmitter();

  totalFollowers: number = null;
  profile_picture_url: string = null;
  mediaUrl: string = null;
  mediaType: string = null;

  isLoader: boolean = false;

  result: any = null;

  constructor(private instagramService: InstagramService, private router: Router) { }

  ngOnInit() {
    this.getMediaInfo();
  }

  // catches Instagram Basic Data
  onBasicData(e) {
    if (e) {
      this.profile_picture_url = e.profile_picture_url;
      this.totalFollowers = e.followers_count;
    }
  }

  getMediaInfo() {

    let postMediaID;
    if (this.proposal && this.proposal.contentPublishID) {
      postMediaID = this.proposal.contentPublishID
    }
    else if (this.mediaID) {
      postMediaID = this.mediaID
    }
    else return;

    this.isLoader = true;
    this.result = this.instagramService.getMedia(postMediaID).subscribe((res: any) => {
      this.isLoader = false;
      if (res) {
        if (!this.isView) {
          this.mediaInfoDone.emit(res);
        }
        this.mediaUrl = res.media_url;
        this.mediaType = res.media_type;
      }
    }, err => {
      if (err) {
        Swal.fire('Unable to retrieve Instagram Data!', '', 'error');

      }
    })
  }


  viewAnalytics() {
    this.router.navigate(['measure/view/', this.proposal.contentPublishID, this.proposal.fee])
  }

}
