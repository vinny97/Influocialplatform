import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProposalService } from 'src/app/@core';
import { Toast } from 'src/app/@helpers/SwalToast';
import { UserType } from 'src/app/@models';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css'],
})
export class ViewComponent implements OnInit {
  proposalID: any = null;
  result = null;
  UserType = UserType;

  constructor(
    private route: ActivatedRoute,
    private proposalService: ProposalService,
    private router: Router,
    private _location: Location
  ) {}

  ngOnInit(): void {
    this.result.price = this.result.price + (0.15*this.result.price);
    this.route.params.subscribe((params) => {
      this.proposalID = params['proposalID'];
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
        console.log(this.result);
      } else {
        this.result = null;
      }
    });
  }

  onClickButton(contentStatus: number) {
    console.log('ContentStatus:' + contentStatus);

    if (contentStatus === 2) {
      this.router.navigate(['/collabs/edit-submission/', this.proposalID]);
    }
  }

  publishContent() {
    this.proposalService
      .updateProposal(this.proposalID, { status: 4 })
      .subscribe((res) => {
        console.log(res);
        if (res.status === 200) {
          this.router.navigate(['capture', res.data.proposal._id]);
        }
      });
  }

  update() {
    this.router.navigate(['capture', this.result._id]);
  }
  onReject() {
    Swal.fire({
      title: 'Are you sure?',
      text: `You want to Delete reject the content!`,
      icon: 'warning',
      confirmButtonText: 'yes Delete It',
      showCancelButton: true,
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.proposalService
          .updateProposal(this.proposalID, { contentStatus: 3 })
          .subscribe((res) => {
            if (res.status === 200) {
              this.result = res.data.proposal;
              Toast.fire({
                title: 'Content marked as rejected',
                icon: 'success',
              });
              this.router.navigate(['collabs/list/2']);
            }
          });
      }
    });
  }
}
