import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProposalService } from 'src/app/@core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-decline-proposal',
  templateUrl: './decline-proposal.component.html',
  styleUrls: ['./decline-proposal.component.css'],
})
export class DeclineProposalComponent implements OnInit {
  @Input() status: number;
  @Input() type: number; // View Type
  @Input() proposalID: any;
  @Output() onDeclineProposal = new EventEmitter();

  constructor(private proposalService: ProposalService) {}

  ngOnInit() {
    console.log(this.proposalID);
  }

  update() {
    this.proposalService
      .updateProposal(this.proposalID, { status: 4 })
      .subscribe((res) => {
        if (res.status === 200) {
          this.onDeclineProposal.emit(res.data.proposal);
          Swal.fire('Proposal Declined!', '', 'success');
          this.status = res.data.proposal.status;
        } else {
          // this.result = null;
        }
      });
  }

  decline() {
    Swal.fire({
      title: 'Do you want to decline the proposal?',
      showCancelButton: true,
      confirmButtonText: `Decline`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.update();
      }
    });
  }
}
