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
import { ProposalService } from 'src/app/@core';
import { Toast } from 'src/app/@helpers/SwalToast';
import { PaypalComponent } from 'src/app/shared/paypal/paypal.component';

@Component({
  selector: 'app-accept-outright',
  templateUrl: './accept-outright.component.html',
  styleUrls: ['./accept-outright.component.css'],
})
export class AcceptOutrightComponent implements OnInit {
  @ViewChild('content') content: TemplateRef<any>;
  @ViewChild(PaypalComponent) PaypalComponent: PaypalComponent;
  @Input() proposalID: any;
  @Input() proposal: any;

  @Output() onOutrightUpdate = new EventEmitter();

  constructor(
    private modalService: NgbModal,
    private proposalService: ProposalService
  ) {}

  ngOnInit() {
    console.log(this.proposal);
    console.log(this.proposalID);
  }

  open() {
    this.modalService.open(this.content, { size: 'lg', centered: true });
  }

  close() {
    this.modalService.dismissAll();
  }

  update(status) {
    if (status === 3) {
      this.PaypalComponent.create();
      this.PaypalComponent.createTransaction();
      this.PaypalComponent.open();
    } else if (status === 2) {
      this.updateOutRightStatus(status);
    } else {
      this.updateOutRightStatus(status);
    }
  }

  updateOutRightStatus(status) {
    console.log(':::Outright Status', status);
    this.proposalService
      .updateProposal(this.proposal._id, { outrightStatus: status })
      .subscribe((res) => {
        console.log(res);
        if (res.status === 200) {
          this.onOutrightUpdate.emit(res.data.proposal.outrightStatus);
          if (status === 3) {
            Toast.fire({
              title: 'Congratulations, You have content outright',
              icon: 'success',
            });
          } else if (status === 4) {
            Toast.fire({ title: 'Outright rejected', icon: 'success' });
          }
          this.close();
        } else {
        }
      });
  }
}
