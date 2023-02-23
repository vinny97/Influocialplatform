import { Component, Input, OnInit } from '@angular/core';
import { InstaService } from 'src/app/@core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-proposal-card-stats',
  templateUrl: './proposal-card-stats.component.html',
  styleUrls: ['./proposal-card-stats.component.css'],
})
export class ProposalCardStatsComponent implements OnInit {
  @Input() userName: string;
  @Input() type: number = 1;
  @Input() isView: boolean = true;
  @Input() pageID: any;
  @Input() longLiveToken: any;
  @Input() instaProfileInfo;
  //user id of proposal creator
  @Input() createdBy: any;
  result: any = null;
  profile: any;
  isLoader = false;
  constructor(private instaService: InstaService) {}

  ngOnInit() {
    console.log(this.pageID && this.longLiveToken);
    if (this.pageID && this.longLiveToken) {
      this.getProfileInformation(this.pageID, this.longLiveToken);
    } else if (this.instaProfileInfo) {
      this.result = this.instaProfileInfo;
    }
  }

  getProfileInformation(pageId, accessToken) {
    console.log('------', pageId, accessToken);
    this.isLoader = true;
    this.instaService
      .getBusinessPageInfo(pageId, accessToken)
      .subscribe((response) => {
        console.log(response);
        this.isLoader = false;
        this.result = response;
      });
  }
}
