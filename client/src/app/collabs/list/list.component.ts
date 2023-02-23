import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OUTRIGHT_STATUS } from 'src/app/@constants';
import { ProposalService } from 'src/app/@core';
import { ProposalSubmissionViewComponent } from 'src/app/widgets/proposal-submission-view/proposal-submission-view.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  @ViewChild(ProposalSubmissionViewComponent)
  ProposalSubmissionView: ProposalSubmissionViewComponent;

  outright = OUTRIGHT_STATUS;

  fee: number = null;
  motivation: any = null;

  type = 1;
  isLoader: boolean = false;
  campaignType = null;

  // Params Variables
  status = 1;
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
      this.campaignType = params['type'];
      if (this.campaignType) {
        this.getAll();
      }
    });
  }

  onTypeClick(type) {
    this.type = type;
    if (type === 6) {
      this.outrightStatus = 1;
      this.status = null;
    } else {
      this.status = type;
      this.outrightStatus = null;
    }
    this.getAll();
  }

  getAll() {
    this.proposalService
      .allInfluencerProposals(
        this.page,
        this.limit,
        this.status,
        this.outrightStatus,
        this.campaignType
      )
      .subscribe((res) => {
        console.log(res);
        // this.isLoader = false;
        if (res.status === 200) {
          this.result = res.data.result;
        } else {
          this.result = null;
        }
      });
  }

  onView(proposal: any) {
    if (proposal.proposalType === 1) {
      if (this.type === 6) {
        if (proposal.outrightStatus === 1) {
          this.router.navigate([`/collabs/outright/`, proposal._id]);
        } else return;
      } else if (proposal.status === 1) {
        this.fee = proposal.fee;
        this.motivation = proposal.motivation;
        this.ProposalSubmissionView.open();
      } else if (proposal.status === 2) {
        if (proposal.contentStatus === 0) {
          this.router.navigate([`collabs/resubmitProposal`, proposal._id]);
        } else {
          this.router.navigate([`/collabs/view/`, proposal._id]);
        }
      } else if (proposal.status == 3) {
        if (proposal.contentStatus == 0) {
          this.router.navigate([`/collabs/submit/`, proposal._id]);
        } else if (proposal.contentStatus == 1) {
          this.ProposalSubmissionView.open();
        } else if (proposal.contentStatus == 2) {
          this.router.navigate(['capture', proposal._id]);
        }
      } else if (proposal.status == 4) {
        this.ProposalSubmissionView.open();
      } else if (proposal.status == 5) {
        this.ProposalSubmissionView.openContentView();
      }
    }

    if (proposal.proposalType === 2) {
      if (this.type === 6) {
        if (proposal.outrightStatus === 1) {
          this.router.navigate([`/collabs/outright/`, proposal._id]);
        } else return;
      } else if (proposal.status === 1) {
        this.fee = proposal.fee;
        this.motivation = proposal.motivation;
        this.ProposalSubmissionView.open();
      } else if (proposal.status === 2) {
        this.router.navigate(['collabs/resubmitProposal', proposal._id]);
      } else if (proposal.status === 3) {
        if (proposal.contentStatus == 0) {
        } else if (proposal.contentStatus == 1) {
          this.router.navigate(['proposal/content/', proposal._id]);
        } else if (proposal.contentStatus == 2) {
          this.router.navigate(['proposal/content/', proposal._id]);
        }
      } else if (proposal.status === 4) {
        this.ProposalSubmissionView.open();
      }
    }
  }
  onClickPage(e) {
    if (e) {
      this.page = e.page;
      this.limit = e.limit;
      this.getAll();
    }
  }
}
