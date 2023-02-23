import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProposalService } from 'src/app/@core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-content-proposal',
  templateUrl: './content-proposal.component.html',
  styleUrls: ['./content-proposal.component.css'],
})
export class ContentProposalComponent implements OnInit {
  proposalID: any = null;
  result = null;

  constructor(
    private route: ActivatedRoute,
    private proposalService: ProposalService,
    private router: Router,
    private _location: Location
  ) {  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.proposalID = params['proposalID'];
      console.log(`proposalID: ${this.proposalID}`);

      if (this.proposalID) {
        this.getData();
      }
    });
  }

  getData() {
    this.proposalService.getProposal(this.proposalID).subscribe((res) => {
      // console.log(res);
      if (res.status === 200) {
        this.result = res.data.proposal;
        console.log(this.result)
      } else {
        this.result = null;
      }
    });
  }

  update(contentStatus) {
    console.log(' Inside Content Update');

    this.proposalService
      .updateProposal(this.proposalID, { contentStatus: contentStatus })
      .subscribe((res) => {
        console.log(res);

        if (res.status === 200) {
          contentStatus === 3
            ? Swal.fire('Content Declined!', '', 'success')
            : Swal.fire('Content Approved!', '', 'success');
          this.result.contentStatus = res.data.proposal.contentStatus;
        } else {
          // this.result = null;
        }
      });
  }

  decline() {
    Swal.fire({
      title: 'Do you want to decline the content proposal?',
      showCancelButton: true,
      confirmButtonText: `Decline`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.update(3);
      }
    });
  }

  approve() {
    Swal.fire({
      title: 'Do you want to approve the content proposal?',
      showCancelButton: true,
      confirmButtonText: `Approve`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.update(2);
      }
    });
  }

  outRightClicked(e) {
    if (e) {
      this.result.outrightStatus = +e;
    }
  }
}
