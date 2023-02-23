import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProposalService } from 'src/app/@core/services/proposal.service';
import { UnlinkService } from 'src/app/@core/services/unlink.service';
import { Toast } from 'src/app/@helpers/SwalToast';

@Component({
  selector: 'app-submit-content-brand',
  templateUrl: './submit-content-brand.component.html',
  styleUrls: ['./submit-content-brand.component.css'],
})
export class SubmitContentBrandComponent implements OnInit {
  proposalID: any = null;
  result = null;
  url = '';

  isSubmitContent: boolean = false;
  isEdit: boolean = false;
  isOutRight: boolean = false;

  form: FormGroup;
  isSubmit = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private proposalService: ProposalService,
    private router: Router,
    private unlinkService: UnlinkService
  ) {
    this.router.events.subscribe((evt) => {
      this.url = this.router.url.split('/')[2];
      console.log(this.url);

      if (this.url === 'edit-submission') {
        this.isEdit = true;
      } else if (this.url === 'outright') {
        this.isOutRight = true;
      } else {
        this.isSubmitContent = true;
      }
    });
  }

  ngOnInit(): void {
    this.create();

    this.route.params.subscribe((params) => {
      this.proposalID = params['proposalID'];
      if (this.proposalID) {
        this.getData();
      }
    });
  }

  create() {
    this.form = this.fb.group({
      contentPost: [[], [Validators.required]],
      contentCaption: ['', [Validators.required]],
    });
    console.log(this.f.contentPost.value.length);
  }

  get f() {
    return this.form.controls;
  }

  onUploadImage(imgUrl) {
    this.f.contentPost.setValue([...this.f.contentPost.value, imgUrl]);
    console.log(this.f.contentPost.value);
  }

  getData() {
    this.proposalService.getProposal(this.proposalID).subscribe((res) => {
      // console.log(res);
      if (res.status === 200) {
        this.result = res.data.proposal;
      }
    });
  }

  onSubmit() {
    this.isSubmit = true;
    console.log(this.form.value);

    if (this.form.invalid) {
      console.log('empty form');
      return;
    }
    this.proposalService
      .updateProposal(this.proposalID, {
        ...this.form.value,
        contentStatus: 1,
      })
      .subscribe((response) => {
        console.log(response);
        if (response.status === 200) {
          Toast.fire({
            title:
              'Content submitted successfully. You will be notified once the Influencer will publish the content.',
            icon: 'success',
          });
          this.router.navigate([
            'proposal/campaign-proposals',
            response.data.proposal.campaign,
          ]);
        } else {
          Toast.fire({
            title: 'An unknown error occurred',
            icon: 'error',
          });
        }
      });
  }

  onRemoveImage(img) {
    this.f.contentPost.setValue([
      ...this.f.contentPost.value.filter((e) => e !== img),
    ]);
    console.log(this.f.contentPost.value);
  }
}
