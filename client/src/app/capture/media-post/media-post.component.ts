import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ProposalService } from 'src/app/@core/services/proposal.service';

@Component({
  selector: 'app-media-post',
  templateUrl: './media-post.component.html',
  styleUrls: ['./media-post.component.css'],
})
export class MediaPostComponent implements OnInit {
  model: NgbDateStruct;

  proposalID: any;
  result: any = null;
  isLoader: boolean = false;
  hello = ['hello', 'hi'];

  constructor(
    private route: ActivatedRoute,
    private proposalService: ProposalService
  ) {}

  ngOnInit(): void {
    this.getContent();
  }

  getContent() {
    this.route.params.subscribe((params) => {
      this.proposalID = params['proposalID'];
      console.log(this.proposalID);
    });
    if (this.proposalID) {
      this.isLoader = true;
      this.proposalService
        .getProposal(this.proposalID)
        .subscribe((response) => {
          console.log(response);
          if (response.status === 200) {
            this.isLoader = false;
            console.log('::::Isloader:::', this.isLoader);
            this.result = response.data.proposal;
            console.log(this.result);
          }
        });
    }
  }
}
