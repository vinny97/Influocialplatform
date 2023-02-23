import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PROPOSAL_STATUS } from 'src/app/@constants';
import { ProposalService } from 'src/app/@core';
import { Toast } from 'src/app/@helpers/SwalToast';
import { PaypalComponent } from 'src/app/shared/paypal/paypal.component';

@Component({
  selector: 'app-accept-proposal',
  templateUrl: './accept-proposal.component.html',
  styleUrls: ['./accept-proposal.component.css'],
})
export class AcceptProposalComponent implements OnInit {
  @ViewChild('content') content: TemplateRef<any>;
  @ViewChild(PaypalComponent) PaypalComponent: PaypalComponent;

  @Input() proposalID: any;
  @Output() onSubmit = new EventEmitter();

  proposalStatus = PROPOSAL_STATUS;

  constructor(
    private modalService: NgbModal,
    private proposalService: ProposalService
  ) {}

  ngOnInit() {}

  open() {}

  close() {
    this.modalService.dismissAll();
  }

  updateProposal(status) {
    console.log(status);
    this.proposalService
      .updateProposal(this.proposalID, { status: status })
      .subscribe((res) => {
        console.log(res);
        if (res.status === 200) {
          this.onSubmit.emit(res.data.proposal);
          Toast.fire({ title: 'Proposal Accepted', icon: 'success' });
          this.close();
          // this.result = res.data.proposal;
        } else {
          // this.result = null;
        }
      });
  }
  update() {
    console.log('inside accept update');

    this.PaypalComponent.create();
    this.PaypalComponent.createTransaction();
    this.PaypalComponent.open();
  }
}
