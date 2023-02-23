import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CampaignService } from 'src/app/@core';
import { Toast } from 'src/app/@helpers/SwalToast';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  form: FormGroup;
  isSubmit = false;
  campaignID = null;


  constructor(private fb: FormBuilder, private route: ActivatedRoute, private campaignService: CampaignService, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.campaignID = params['campaignID'];
    });
    this.create();
  }

  create() {
    this.form = this.fb.group({
      motivation: ['', [Validators.required]],
      fee: ['', [Validators.required]],
    });
  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.isSubmit = true;
    if (this.form.invalid) {
      return;
    }

    this.campaignService.addProposal(this.campaignID, { ...this.form.value }).subscribe(res => {
      // console.log("Proposal", res);
      if (res.status === 200) {
        Toast.fire({ title: 'Proposal sent', icon: 'success' });
        this.router.navigate(['/campaigns/', this.campaignID]);
      }
      else {
      }

    })
  }

}
