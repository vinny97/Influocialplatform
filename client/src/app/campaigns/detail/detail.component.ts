import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BrandService, CampaignService, UserService } from 'src/app/@core';
import { UserType } from 'src/app/@models';
import { RejectMessageComponent } from 'src/app/campaigns/reject-message/reject-message.component';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class DetailComponent implements OnInit {
  @ViewChild(RejectMessageComponent) rejectMessage: RejectMessageComponent;

  result = null;
  campaignID = null;
  userID = null;

  UserType = UserType;
  images = [
    'assets/song-girl.png',
    'assets/song-girl.png',
    'assets/song-girl.png',
  ];
  user: any;
  brand: any;

  constructor(
    private route: ActivatedRoute,
    private campaignService: CampaignService,
    private router: Router,
    private userService: UserService,
    private brandService: BrandService
  ) { }

  ngOnInit(): void {
    this.userID = this.userService.getCurrentUser()._id;
    this.user = this.userService.getCurrentUser();
    console.log(this.user)
    this.route.params.subscribe((params) => {
      this.campaignID = params['id'];
      if (this.campaignID) {
        this.getData();
      }
    });
  }

  getData() {
    this.campaignService.getCampaign(this.campaignID).subscribe((res) => {
      console.log(res);
      if (res.status === 200) {
        this.result = res.data.campaign;
        console.log(this.result)
        if (this.result.brandId) {
          this.brandService.getById(this.result.brandId).subscribe((res) => {
            console.log(res)
            if (res.status === 200) {
              this.brand = res.data.brand
            }
          })

        }
      }
    });
  }

  // If Influencer has sent Proposal
  isProposalSent(proposals) {
    if (proposals && proposals.length > 0) {
      return proposals.some((proposal) => proposal.influencer === this.userID)
        ? true
        : false;
    }
  }

  // returns status for influencer
  getProposalStatus(proposals) {
    if (proposals && proposals.length > 0) {
      return proposals.find((p) => p.influencer === this.userID).status;
    }
  }

  // Displays Proposal
  proposal(id) {
    this.router.navigate(['proposal/create/', id]);
  }

  // if brand/ agency Clicks
  brandClick(status) {
    if (status === 4) {
      this.rejectMessage.open();
    }
  }

  // if status of campaign is changed
  onStatusChange(e) {
    if (e) {
      this.result.status = e;
    }
  }
}
