import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProposalService } from 'src/app/@core/services/proposal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-allow-rebid',
  templateUrl: './allow-rebid.component.html',
  styleUrls: ['./allow-rebid.component.css'],
})
export class AllowRebidComponent implements OnInit {
  @Input() proposalID: any;
  @Output() onAllowingRebid = new EventEmitter();
  constructor(private proposalService: ProposalService) {}

  ngOnInit() {
    console.log(this.proposalID);
  }

  allowRebid() {
    this.proposalService
      .updateProposal(this.proposalID, { status: 2, rebid: 1 })
      .subscribe((response) => {
        console.log(response);
        if (response.status === 200) {
          this.onAllowingRebid.emit();
          Swal.fire(
            'You have allowed the sender to rebid the proposal',
            '',
            'success'
          );
        } else {
          Swal.fire('An unknown error occured', '', 'error');
        }
      });
  }
}
