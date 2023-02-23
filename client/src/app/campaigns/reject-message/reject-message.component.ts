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
import { CampaignService } from 'src/app/@core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reject-message',
  templateUrl: './reject-message.component.html',
  styleUrls: ['./reject-message.component.css'],
})
export class RejectMessageComponent implements OnInit {
  @ViewChild('content') content: TemplateRef<any>;

  @Input() id: any;
  @Input() isView: boolean;
  @Input() message: any;

  @Output() campaignRejected = new EventEmitter();

  rejectMessage = null;

  constructor(
    private modalService: NgbModal,
    private campaignService: CampaignService
  ) {}

  ngOnInit() {}

  open() {
    this.modalService.open(this.content, { size: 'lg', centered: true });
  }
  onRejectClick(brandId) {
    Swal.fire({
      text: `Do you really want to reject the campaign?`,
      icon: 'warning',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonColor: 'Red',
    }).then((result) => {
      if (result.isConfirmed) {
        this.campaignService
          .updateCampaign(brandId, { status: 4 })
          .subscribe((res) => {
            if (res.status === 200) {
              Swal.fire('Campaign Rejected', '', 'success');
              this.campaignRejected.emit(4);
            }
          });
      }
    });
  }

  close() {
    this.modalService.dismissAll();
  }

  update() {
    this.campaignService
      .updateCampaign(this.id, { status: 4, rejectMessage: this.rejectMessage })
      .subscribe((res) => {
        if (res.status === 200) {
          this.close();
          this.campaignRejected.emit(4);
          Swal.fire('Campaign rejected', '', 'success');
        }
      });
  }
}
