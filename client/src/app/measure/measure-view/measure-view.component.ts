import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InstagramService } from 'src/app/@core';
import { getEngagement, getImpressions, getReach, getVideoViews } from 'src/app/@helpers/media-insights';

@Component({
  selector: 'app-measure-view',
  templateUrl: './measure-view.component.html',
  styleUrls: ['./measure-view.component.css']
})
export class MeasureViewComponent implements OnInit {
  images = [
    "assets/ice.png", "assets/ice.png", "assets/ice.png"
  ]

  mediaID: string = null;
  mediaType: string = null;
  fee: number = null;
  impressions: number = null;
  reach: number = null;
  engagement: number = null;
  videoViews: number = null;

  totalFollowers: number = null;


  mediaBasicInfo: any = null;
  constructor(private instagramService: InstagramService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.mediaID = params['mediaID'];
      this.fee = params['fee'];
    });
  }


  onMediaBasicInfo(e) {
    if (e) {
      this.mediaBasicInfo = e;
      this.mediaType = this.mediaBasicInfo.media_type;
      if (this.mediaType) {
        this.mediaInsights();
      }
    }

  }

  // catches Instagram Basic Data
  onBasicData(e) {
    if (e) {
      this.totalFollowers = e.followers_count;
    }
  }

  get costPerEngagement() {
    return this.engagement ? this.fee / this.engagement : 0;
  }

  get engagementPercentage() {
    return this.totalFollowers ? ((this.engagement / this.totalFollowers) * 100).toFixed(2) : 0;
  }

  get reachPercentage() {
    return this.totalFollowers ? ((this.reach / this.totalFollowers) * 100).toFixed(2) : 0;
  }

  get viewsPercentage() {
    return this.totalFollowers ? ((this.videoViews / this.totalFollowers) * 100).toFixed(2) : 0;

  }

  mediaInsights() {
    this.instagramService.getMediaInsights(this.mediaID, this.mediaType).subscribe((res: any) => {
      console.log(res);

      if (this.mediaType === 'VIDEO') {
        this.videoViews = getVideoViews(res.data)
      }
      this.impressions = getImpressions(res.data);
      this.reach = getReach(res.data);
      this.engagement = getEngagement(res.data);
    })

  }

}
