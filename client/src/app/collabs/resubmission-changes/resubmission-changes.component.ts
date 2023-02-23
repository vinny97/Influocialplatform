import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProposalService } from 'src/app/@core/services/proposal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-resubmission-changes',
  templateUrl: './resubmission-changes.component.html',
  styleUrls: ['./resubmission-changes.component.css'],
})
export class ResubmissionChangesComponent implements OnInit {
  result: any;
  isLoader = false;
  form: FormGroup;
  proposalID: any;

  constructor(
    private route: ActivatedRoute,
    private proposalService: ProposalService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.proposalID = params['proposalID'];
      if (this.proposalID) {
        this.isLoader = true;
        this.proposalService
          .getProposal(this.proposalID)
          .subscribe((response) => {
            if (response.status === 200) {
              this.isLoader = false;
              console.log(':::::RESPONSE', response);
              this.result = response.data.proposal;
            }
          });
      } else {
        this.result = 'Proposal ID not found!';
      }
    });
    this.create();
  }

  create() {
    this.form = this.fb.group({
      fee: [null, Validators.required],
    });
  }

  onSubmit() {
    console.log('inside');

    if (this.form.invalid) {
      return;
    }

    console.log(this.form.value);
    this.proposalService
      .updateProposal(this.proposalID, {
        ...this.form.value,
        status: 1,
        rebid: 2,
      })
      .subscribe((response) => {
        console.log('new proposal', response);
        Swal.fire('Proposal updated with new bid!', '', 'success');
        this.form.reset();
        if (response.data.proposal.proposalType == 1) {
          this.router.navigate(['/collabs/list/1']);
        } else if (response.data.proposal.proposalType == 2) {
          this.router.navigate(['/collabs/list/2']);
        }
      });
  }

  get f() {
    return this.form.controls;
  }
}
