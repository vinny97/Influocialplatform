import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { ProposalService } from 'src/app/@core/services/proposal.service';
import { SettingsService } from 'src/app/@core/services/settings.service';
import { TransactionService } from 'src/app/@core/services/transaction.service';
import { UserService } from 'src/app/@core/services/user.service';
import { Toast } from 'src/app/@helpers/SwalToast';

@Component({
  selector: 'app-paypal',
  templateUrl: './paypal.component.html',
  styleUrls: ['./paypal.component.css'],
})
export class PaypalComponent implements OnInit {
  @Output() payPalResponse = new EventEmitter<any>();
  @Input() onProposalAccept: any;
  @Input() proposalID: any;
  public payPalConfig?: IPayPalConfig;

  @ViewChild('content') content;
  // amount: any;
  @Output() transDetail = new EventEmitter();

  form!: FormGroup;

  description: any;
  amount: any;
  campaignID: any;
  transactionID: any;
  payPalClientId: any;
  transactionDetails: any;
  status: number = null;
  payPalData: any = {};
  currentUser: any;
  fee: any;
  proposal: any;
  constructor(
    private modalService: NgbModal,
    private transactionService: TransactionService,
    private proposalService: ProposalService,
    private settingsService: SettingsService,
    private userService: UserService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.getPaypalClientID();
    this.getProposal();
    this.userService.currentUser.subscribe((u) => (this.currentUser = u));
  }

  create() {
    this.form = this.fb.group({
      name: ['Proposal Fee', Validators.required], //purpose of the payment
      user: [this.currentUser, Validators.required], // Name of currernly logged in user{Admin, Brand, Agency}
      price: [this.proposal.fee, Validators.required], //Proposal Fee
      campaign: [this.proposal.campaign._id, Validators.required], // Campaign ID
      proposal: [this.proposalID, Validators.required], // Proposal ID
      status: [1, Validators.required], // // Transaction status default: {1}
    });
  }

  getPaypalClientID() {
    this.settingsService.getSettings().subscribe((response: any) => {
      if (response.status === 200) {
        this.payPalClientId = response.data.paypalClientID;
        this.initConfig();
      }
    });
  }
  getProposal() {
    this.proposalService.getProposal(this.proposalID).subscribe((response) => {
      this.proposal = response.data.proposal;

      //for proposal fee
      if (this.proposal.status == 1 || this.proposal.contentStatus == 0) {
        this.fee = this.proposal.fee;
        this.fee = this.fee + (0.15 * this.fee);
      }

      //for outright fee
      if (
        this.proposal.outrightStatus == 2 &&
        this.proposal.outrightFee != null
      ) {
        this.fee = this.proposal.outrightFee;
        this.fee = this.proposal.outrightFee + (0.15 * this.proposal.outrightFee);
      }
    });
  }
  private initConfig(): void {
    this.payPalConfig = {
      currency: 'USD',
      clientId: this.payPalClientId,
      createOrderOnClient: (data) =>
        <ICreateOrderRequest>{
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code: 'USD',
                value: this.fee,
                breakdown: {
                  item_total: {
                    currency_code: 'USD',
                    // increasing fee by 15%
                    value: this.fee,
                  },
                },
              },
              items: [
                {
                  name: 'time Proposal fee',
                  quantity: '1',
                  category: 'DIGITAL_GOODS',
                  unit_amount: {
                    currency_code: 'USD',
                    // increasing fee by 15%
                    value: this.fee,
                  },
                },
              ],
            },
          ],
        },
      advanced: {
        commit: 'true',
      },
      style: {
        label: 'paypal',
        layout: 'vertical',
        color: 'blue',
      },
      onApprove: (data, actions) => {
        // console.log(
        //   'onApprove - transaction was approved, but not authorized',
        //   data,
        //   actions
        // );
        actions.order.get().then((details) => {
          // console.log(
          //   'onApprove - you can get full order details inside onApprove: ',
          //   details
          // );
        });
      },
      onClientAuthorization: (data) => {
        if (data.status === 'COMPLETED') {
          this.payPalData = data;
          this.status = 2;
          this.updateTransaction();
        }
      },
      onCancel: (data, actions) => {
        this.payPalData = data;
        this.status = 3;

        this.updateTransaction();
        Toast.fire({ title: 'Purchase canceled', icon: 'error' });
        this.modalService.dismissAll();
      },
      onError: (err) => { },
      onClick: (data, actions) => { },
    };
  }

  open() {
    this.modalService.open(this.content, { centered: true });
  }

  //create transaction
  createTransaction() {
    this.transactionService
      .createTransaction(this.form.value)
      .subscribe((res) => {
        this.transactionID = res.data.transaction._id;
      });
  }
  // Updates Transaction Data
  updateTransaction() {
    this.transactionService
      .update(this.transactionID, {
        status: this.status,
        payPalData: this.payPalData,
      })
      .subscribe(
        (res) => {
          if (res.status === 200 && this.status == 2) {
            Toast.fire({ title: 'Payment was successful', icon: 'success' });
            this.payPalResponse.emit();
            this.modalService.dismissAll();
          } else if (res.status === 200 && this.status == 3) {
            Toast.fire('Transaction Canceled!', '', 'error');
            this.modalService.dismissAll();
          } else {
            Toast.fire('Something is wrong!', '', 'error');
            this.modalService.dismissAll();
          }
        },

        (err) => {
          Toast.fire('Something is wrong!', '', 'error');
          this.modalService.dismissAll();
        }
      );
  }
}
