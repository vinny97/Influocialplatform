import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProposalService } from 'src/app/@core';

@Component({
  selector: 'app-favorite-toggle',
  templateUrl: './favorite-toggle.component.html',
  styleUrls: ['./favorite-toggle.component.css']
})
export class FavoriteToggleComponent implements OnInit {

  @Input() isFavorite: boolean;
  @Input() proposalID: any;

  isLoader: boolean = false;


  constructor(private proposalService: ProposalService) { }

  ngOnInit() {
  }

  update() {
    this.isLoader = true;
    this.proposalService.updateProposal(this.proposalID, { isFavorite: !this.isFavorite }).subscribe(res => {
      if (res.status === 200) {
        this.isLoader = false;
        this.isFavorite = res.data.proposal.isFavorite;
      } else {
        this.isLoader = false;
        // this.result = null;
      }
    })
  }

}
