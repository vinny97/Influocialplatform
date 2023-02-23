import { Component, Input, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/@core';

@Component({
  selector: 'app-proposal-portfolio-tab',
  templateUrl: './proposal-portfolio-tab.component.html',
  styleUrls: ['./proposal-portfolio-tab.component.css'],
})
export class ProposalPortfolioTabComponent implements OnInit {
  @Input() longLiveToken: any;
  @Input() pageID: any;
  @Input() influencerId: any;
  result: any;
  constructor(private profileService: ProfileService) {}

  ngOnInit() {
    this.getAll();
  }
  getAll() {
    this.profileService.getAllPortfoliosById(this.influencerId).subscribe(
      (response) => {
        this.result = response.data.result.docs;
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
