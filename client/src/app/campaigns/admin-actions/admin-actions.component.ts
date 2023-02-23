import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CampaignService } from 'src/app/@core';
import Swal from 'sweetalert2';
import { RejectMessageComponent } from '../reject-message/reject-message.component';

@Component({
  selector: 'app-admin-actions',
  templateUrl: './admin-actions.component.html',
  styleUrls: ['./admin-actions.component.css'],
})
export class AdminActionsComponent implements OnInit {
  @ViewChild(RejectMessageComponent) rejectMessage: RejectMessageComponent;

  @Input() result: any;
  @Output() statusChanged = new EventEmitter();

  constructor(private campaignService: CampaignService) {}

  ngOnInit() {
    console.log(this.result);
  }

  onReject() {
    this.rejectMessage.onRejectClick(this.result?._id);
  }

  statusUpdated(e) {
    console.log(e);

    if (e) {
      this.statusChanged.emit(4);
    }
  }

  update() {
    this.campaignService
      .updateCampaign(this.result._id, { status: 2 })
      .subscribe((res) => {
        if (res.status === 200) {
          this.statusChanged.emit(2);
          Swal.fire('Campaign Approved', '', 'success');
        }
      });
  }
}
