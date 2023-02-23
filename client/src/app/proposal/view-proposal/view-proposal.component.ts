import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InstaService, ProposalService, UserService } from 'src/app/@core';
import { Toast } from 'src/app/@helpers/SwalToast';
import { PaypalComponent } from 'src/app/shared/paypal/paypal.component';
import { AcceptProposalComponent } from 'src/app/widgets/accept-proposal/accept-proposal.component';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-view-proposal',
  templateUrl: './view-proposal.component.html',
  styleUrls: ['./view-proposal.component.css'],
})
export class ViewProposalComponent implements OnInit {
  @ViewChild(PaypalComponent)
  PaypalComponent: PaypalComponent;

  proposalID = null;
  result = null;
  isLoader: boolean;
  instaProfileInfo: any;

  constructor(
    private route: ActivatedRoute,
    private proposalService: ProposalService,
    private userService: UserService,
    private instaService: InstaService
  ) {}

  ngOnInit(): void {
    this.isLoader = true;
    this.route.params.subscribe((params) => {
      this.proposalID = params['proposalID'];
      if (this.proposalID) {
        this.isLoader = false;
        this.getData();
      }
    });
  }

  acceptProposal() {
    this.PaypalComponent.create();
    this.PaypalComponent.createTransaction();
    this.PaypalComponent.open();
  }
  updateProposal() {
    this.proposalService
      .updateProposal(this.proposalID, { status: 3 })
      .subscribe((response) => {
        console.log(response);
        if (response.status === 200) {
          this.getData();
        }
      });
  }

  onAccept(e) {
    if (e && e.status) {
      this.result.status = e.status;
      Toast.fire({ title: 'Proposal Approved', icon: 'success' });
    }
  }

  onDecline(e) {
    if (e && e.status) {
      this.result.status = e.status;
    }
  }

  getData() {
    console.log('Inside get data');
    this.isLoader = true;
    this.proposalService.getProposal(this.proposalID).subscribe((res) => {
      console.log(res);
      if (res.status === 200) {
        this.result = res.data.proposal;
        console.log(this.result);
        console.log('influencer id---', this.result?.influencer._id);
        this.isLoader = false;
        this.getPageIdAndAccessToken(res.data.proposal.influencer._id);
      } else {
        this.isLoader = false;
        this.result = null;
      }
    });
  }

  getPageIdAndAccessToken(influencerID) {
    this.isLoader = true;
    this.userService.getUserById(influencerID).subscribe((response) => {
      console.log(response);
      if (response.data.user.instagram == null) {
        Swal.fire('User has not connected Instagram yet', '', 'error');
        this.isLoader = false;
      } else {
        const pageId = response.data.user.instagram.profileInfo.id;
        const accessToken = response.data.user.instagram.longLiveAccessToken;
        this.isLoader = false;
        this.getProfileInformation(pageId, accessToken);
      }
    });
  }
  getProfileInformation(pageId, accessToken) {
    this.isLoader = true;
    this.instaService
      .getBusinessPageInfo(pageId, accessToken)
      .subscribe((response) => {
        console.log(response);
        this.isLoader = false;
        this.instaProfileInfo = response;
      });
  }
}
