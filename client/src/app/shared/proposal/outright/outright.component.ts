import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProposalService } from 'src/app/@core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-outright',
  templateUrl: './outright.component.html',
  styleUrls: ['./outright.component.css'],
})
export class OutrightComponent implements OnInit {
  @Input() proposalID: any;
  @Output() onOutRight = new EventEmitter();

  constructor(private proposalService: ProposalService) {}

  ngOnInit() {}

  update() {
    this.proposalService
      .updateProposal(this.proposalID, { outrightStatus: 1 })
      .subscribe((res) => {
        console.log(res);
        if (res.status === 200) {
          this.onOutRight.emit(res.data.proposal.outrightStatus);
          Swal.fire('Content oughtright request sent!', '', 'success');
          // this.status = res.data.proposal.status;
        } else {
          // this.result = null;
        }
      });
  }

  outRight() {
    Swal.fire({
      title: 'Do you want to buy the content outright?',
      showCancelButton: true,
      confirmButtonText: `Yes`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.update();
      }
    });
  }
}
