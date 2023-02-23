import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProposalService } from 'src/app/@core/services/proposal.service';

@Component({
  selector: 'app-measure-post',
  templateUrl: './measure-post.component.html',
  styleUrls: ['./measure-post.component.css']
})
export class MeasurePostComponent implements OnInit {

  page: number = 1;
  limit: number = 6;
  result = null;

  isLoader: boolean = false;
  campaignID = null;

  // Content Status is 4 for published contents
  contentStatus: number = 4;


  constructor(private proposalService: ProposalService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.campaignID = params['id'];
      if (this.campaignID) {
        this.getAll();
      }
    });
  }

  getAll() {
    this.isLoader = true;
    this.proposalService.getAll(this.page, this.limit, this.campaignID, null, null, null, this.contentStatus).subscribe(res => {
      this.isLoader = false;
      if (res.status === 200) {
        this.result = res.data.result;
      } else {
        this.result = null;
      }
    })
  }


  onClickPage(e) {
    if (e) {
      this.page = e.page;
      this.limit = e.limit;
      this.getAll();
    }
  }

}
