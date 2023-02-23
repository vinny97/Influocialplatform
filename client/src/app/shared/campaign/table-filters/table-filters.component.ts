import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CAMPAIGN_STATUS } from 'src/app/@constants/campaign-status';
import { CAMPAIGN_TYPE } from 'src/app/@constants/campaign-type';

@Component({
  selector: 'app-table-filters',
  templateUrl: './table-filters.component.html',
  styleUrls: ['./table-filters.component.css'],
})
export class TableFiltersComponent implements OnInit {

  campaignTypes = CAMPAIGN_TYPE;
  selectedCampaignType: number = 0;
  type = 2;
  namesearch: string = '';
  @Output() onFilterChange = new EventEmitter();
  @Output() onCampaignTypeChanged = new EventEmitter();


  @Output() onSearchClicked = new EventEmitter();
  @Input() brandID: any = null;

  status = CAMPAIGN_STATUS;
  constructor(private router: Router) { }

  onTypeClick(type) {
    this.type = type;
    this.onFilterChange.emit(this.type);
  }

  ngOnInit() { }

  onSearchClick() {
    this.onSearchClicked.emit(this.namesearch);
  }

  // Campaign type Select is changed
  campaignTypeSelected() {
    this.onCampaignTypeChanged.emit(this.selectedCampaignType);
  }

  isEmpty() {
    if (this.namesearch == '' || this.namesearch == null) {
      this.onSearchClicked.emit('');
    }
  }
  createCampaign() {
    this.router.navigate([`/brands/${this.brandID}/campaigns/create`]);
  }
}
