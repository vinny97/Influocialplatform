import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OUTRIGHT_STATUS } from 'src/app/@constants';
import { ProposalService } from 'src/app/@core';
import { Toast } from 'src/app/@helpers/SwalToast';
import { PaypalComponent } from 'src/app/shared/paypal/paypal.component';
import { AcceptOutrightComponent } from 'src/app/widgets/accept-outright/accept-outright.component';
import { AcceptProposalComponent } from 'src/app/widgets/accept-proposal/accept-proposal.component';
import { ProposalSubmissionViewComponent } from 'src/app/widgets/proposal-submission-view/proposal-submission-view.component';

@Component({
  selector: 'app-list-brand',
  templateUrl: './list-brand.component.html',
  styleUrls: ['./list-brand.component.css'],
})
export class ListBrandComponent implements OnInit {
  // Modal
  @ViewChild(AcceptProposalComponent)
  AcceptProposalComponent: AcceptProposalComponent;

  @ViewChild(AcceptOutrightComponent)
  AcceptOutrightComponent: AcceptOutrightComponent;

  @ViewChild(PaypalComponent)
  PaypalComponent: PaypalComponent;

  @ViewChild(ProposalSubmissionViewComponent)
  ProposalSubmissionViewComponent: ProposalSubmissionViewComponent;
  proposalID = null;
  proposal = null;
  payPalData = null;
  outright = OUTRIGHT_STATUS;

  type = 1;
  isLoader: boolean = false;

  // Params Variables
  status = 1;
  isFavorite = null;
  campaignID = null;
  outrightStatus = 0;

  page = 1;
  limit = 6;
  result = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private proposalService: ProposalService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.campaignID = params['campaignID'];
      if (this.campaignID) {
        this.getAll();
      }
    });
  }

  getAll() {
    this.isLoader = true;
    this.proposalService
      .getAll(
        this.page,
        this.limit,
        this.campaignID,
        this.status,
        this.isFavorite,
        this.outrightStatus
      )
      .subscribe((res) => {
        console.log(res);
        this.isLoader = false;
        if (res.status === 200) {
          this.result = res.data.result;
          console.log(this.result);
        } else {
          this.result = null;
        }
      });
  }
  onClickPage(e) {
    if (e) {
      this.page = e.page;
      this.limit = e.limit;
      this.getAll();
    }
  }

  onTypeClick(type) {
    this.type = type;
    if (type === 6) {
      this.isFavorite = 1;
      this.status = null;
    } else if (type === 7) {
      this.isFavorite = 0;
      this.status = null;
      this.outrightStatus = 1;
    } else {
      this.status = type;
      this.isFavorite = null;
    }
    this.getAll();
  }

  viewProposal(proposal: any) {
    console.log(proposal);
    const proposalType = proposal.proposalType;
    if (proposalType == 1) {
      if (this.type === 7) {
        if (proposal.outrightStatus === 2) {
          this.proposal = proposal;
          this.AcceptOutrightComponent.open();
        } else return;
      }
      if (proposal.status === 1) {
        this.router.navigate(['proposal/view', proposal._id]);
      } else if (proposal.status === 2) {
        if (proposal.contentStatus == 0) {
          this.router.navigate(['/collabs/resubmitProposal', proposal._id]);
        } else if (proposal.contentStatus == 1) {
          this.router.navigate(['/proposal/content', proposal._id]);
        }
      } else if (proposal.status === 3) {
        if (proposal.contentStatus == 0) {
        } else if (proposal.contentStatus == 1) {
          this.router.navigate(['/proposal/content', proposal._id]);
        }
      } else if (proposal.status === 4) {
        this.ProposalSubmissionViewComponent.open();
      } else if (proposal.status === 5) {
        this.router.navigate(['/proposal/content', proposal._id]);
      }
    }

    if (proposalType === 2) {
      if (this.type === 7) {
        if (proposal.outrightStatus === 2) {
          this.proposal = proposal;
          this.AcceptOutrightComponent.open();
        } else return;
      } else if (proposal.status === 1) {
        this.router.navigate(['proposal/view', proposal._id]);
      } else if (proposal.status === 2) {
        if (proposal.contentStatus == 1) {
          this.router.navigate(['collabs/view', proposal._id]);
        } else {
          this.router.navigate(['collabs/submitbybrand/', proposal._id]);
        }
      } else if (proposal.status === 3) {
        if (proposal.contentStatus == 0) {
          this.router.navigate(['collabs/submitbybrand', proposal._id]);
        } else if (proposal.contentStatus == 1) {
          this.ProposalSubmissionViewComponent.openContentView();
        } else if (proposal.contentStatus == 2) {
          this.ProposalSubmissionViewComponent.openContentView();
        }
      } else if (proposal.status === 4) {
        this.ProposalSubmissionViewComponent.open();
      }
    }
  }

  // Decline
  onDecline(e) {
    this.getAll();
  }

  // Accept Proposal Modal Functions
  acceptProposal(proposalID) {
    console.log(proposalID);
    this.proposalID = proposalID;
    this.AcceptProposalComponent.update();
  }

  onAccept(e) {
    console.log(e);
    if (e && e.status) {
      Toast.fire({ title: 'Proposal Approved', icon: 'success' });
    }
    this.proposalID = null;
    this.getAll();
  }

  outRightUpdate(e) {
    if (e) {
      this.proposalID = null;
      this.getAll();
    }
  }
}
