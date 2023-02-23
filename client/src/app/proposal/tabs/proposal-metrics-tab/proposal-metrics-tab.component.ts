import { Component, Input, OnInit } from '@angular/core';
import { InstagramService, InstaService } from 'src/app/@core';

@Component({
  selector: 'app-proposal-metrics-tab',
  templateUrl: './proposal-metrics-tab.component.html',
  styleUrls: ['./proposal-metrics-tab.component.css'],
})
export class ProposalMetricsTabComponent implements OnInit {
  @Input() longLiveToken: any = null;
  @Input() pageID: any = null;

  isLoader: boolean = false;
  result28 = null;
  resultDay = null;

  impressions: number = null;
  reach: number = null;
  profileViews: number = null;
  totalPosts: number = null;
  totalFollowers: number = null;

  engagement: number = null;
  totalLikesComments: number = null;

  constructor(private instaService: InstaService) {}

  ngOnInit() {
    if (this.longLiveToken !== null && this.pageID !== null) {
      this.getProfileInfo();
      this.getInsight28();
      // this.getInsightDay();
    }
    console.log(this.pageID, this.longLiveToken);
  }

  getInsight28() {
    this.isLoader = true;

    this.instaService
      .getinsights_28Days(this.pageID, this.longLiveToken)
      .subscribe(
        (response) => {
          console.log(response);
          this.result28 = response.data;
          if (this.result28.length > 0) {
            console.log('inside reach');
            this.findReach();
            this.findImpressions();
          }
        },
        (err) => {
          console.log(err.error);
        }
      );
  }
  getProfileInfo() {
    this.instaService
      .getBusinessPageInfo(this.pageID, this.longLiveToken)
      .subscribe((response) => {
        console.log(response);
        this.onBasicData(response);
      });
  }
  getInsightDay() {
    this.isLoader = true;
    this.instaService
      .getiDailyInsights(this.pageID, this.longLiveToken)
      .subscribe((res) => {
        console.log(res);
        this.resultDay = res.data;
        this.findProfileViews();
        this.isLoader = false;
      });
  }

  findImpressions() {
    if (this.result28) {
      let obj = this.result28.find((a) => a.name === 'impressions');
      this.impressions = obj.values[0].value;
      console.log('Impressions', this.impressions);
    }
  }

  get averageImpressions() {
    return !this.totalPosts || this.totalPosts === 0
      ? 0
      : (this.impressions / this.totalPosts).toFixed(2);
  }

  findReach() {
    if (this.result28 != null) {
      console.log('results28', this.result28);
      let obj = this.result28.find((a) => a.name === 'reach');
      console.log(obj);
      this.reach = obj?.values[0]?.value;
      console.log('reach', this.reach);
    }
  }

  get averageReach(): any {
    return !this.totalPosts || this.totalPosts === 0
      ? 0
      : (this.reach / this.totalPosts).toFixed(2);
  }

  get averageReachPercentage() {
    return !this.totalFollowers || this.totalFollowers === 0
      ? 0
      : ((this.averageReach / this.totalFollowers) * 100).toFixed(2);
  }

  findProfileViews() {
    if (this.resultDay != null) {
      let obj = this.resultDay.find((a) => a.name === 'profile_views');
      this.profileViews = obj.values[1].value;
    }
  }

  // catches Total posts event
  onBasicData(e) {
    if (e) {
      this.totalPosts = e.media_count;
      this.totalFollowers = e.followers_count;
    }
  }

  // gets Engagement and total of likes and comments
  onEngagementDone(e) {
    if (e) {
      this.engagement = e.engagement;
      this.totalLikesComments = e.likesComments;
    }
  }

  // Average Engagement
  get engagementPercentage() {
    return !this.totalFollowers || this.totalFollowers === 0
      ? 0
      : ((this.totalLikesComments / this.totalFollowers) * 100).toFixed(2);
  }
}
