import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { InstaService } from 'src/app/@core';
import { InstaPostComponent } from '../insta-post/insta-post.component';

@Component({
  selector: 'app-proposal-posts-tab',
  templateUrl: './proposal-posts-tab.component.html',
  styleUrls: ['./proposal-posts-tab.component.css'],
})
export class ProposalPostsTabComponent implements OnInit {
  @Input() longLiveToken: any = null;
  @Input() pageID: any = null;

  @Input() userName: string;
  @Input() isView: boolean = true;
  @ViewChild(InstaPostComponent)
  InstaPostComponent: InstaPostComponent;
  @Output()
  onRequestDone = new EventEmitter();

  isLoader: boolean = false;
  result: any = [];

  engagement: number = 0;

  ENGAGEMENT_POST_COUNT: number = 10;
  mediaID: any = null;
  mediaObject: any;

  // pagination
  limit = 25;
  constructor(private instaService: InstaService) {}

  ngOnInit() {
    console.log(this.result);
    console.log(this.pageID, this.longLiveToken);
    if (this.pageID && this.longLiveToken) {
      this.getMediaIDs();
    }
  }
  getMediaIDs() {
    this.instaService
      .getMediaIDs(this.pageID, this.longLiveToken)
      .subscribe((response) => {
        console.log(response);

        if (response != null) {
          response.data.forEach((mediaID) => {
            this.instaService
              .getMediaObject(mediaID.id, this.longLiveToken)
              .subscribe(
                (mediaObject) => {
                  this.result.push(mediaObject);
                },
                (err) => {
                  console.log(err);
                }
              );
          });
        }
      });
  }
  // pagination
  back() {}
  next() {}
  // Calculates Engagement and total likes and comments
  // calculateEngagement() {
  //   if (!this.result) {
  //     this.onRequestDone.emit(0);
  //   } else {
  //     let totalEngagement = 0;
  //     this.result.data.slice(0, 10).forEach((post) => {
  //       if (post.like_count) {
  //         totalEngagement += post.like_count;
  //       }
  //       if (post.comments_count) {
  //         totalEngagement += post.comments_count;
  //       }
  //     });

  //     if (this.result.data.length === 0) {
  //       this.engagement = 0;
  //     }
  //     // if posts are less than specific count
  //     else if (this.result.data.length < this.ENGAGEMENT_POST_COUNT) {
  //       this.engagement = totalEngagement / this.result.data.length;
  //     } else {
  //       this.engagement = totalEngagement / this.ENGAGEMENT_POST_COUNT;
  //     }

  //     // emits data
  //     this.onRequestDone.emit({
  //       engagement: this.engagement.toFixed(2),
  //       likesComments: totalEngagement,
  //     });
  //   }
  // }
}
