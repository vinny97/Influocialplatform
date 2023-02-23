import { Component, OnInit } from '@angular/core';
import { CampaignService } from 'src/app/@core/services';

@Component({
  selector: 'app-admin-list',
  templateUrl: './admin-list.component.html',
  styleUrls: ['./admin-list.component.css'],
})
export class AdminListComponent implements OnInit {
  isLoader: Boolean = false;

  status = 2;

  page = 1;
  limit = 6;
  type: number = 0;
  result = null;
  nameSearch: string = '';
  constructor(private campaignService: CampaignService) {}

  ngOnInit(): void {
    this.getAll();
  }

  getAll() {
    this.isLoader = true;
    this.campaignService
      .getAll(this.page, this.limit, this.status, this.nameSearch, this.type)
      .subscribe((res) => {
        console.log(res);
        this.isLoader = false;
        if (res.status === 200) {
          this.result = res.data.result;
        } else {
          this.result = null;
        }
      });
  }

  onTypeClick(e) {
    if (e) {
      this.status = e;
      this.getAll();
    }
  }

  campaignTypeChange(e: number) {
    if (e || e === 0) {
      this.type = e;
      this.getAll();
    }
  }

  onClickPage(e) {
    if (e) {
      this.page = e.page;
      this.limit = e.limit;
      this.getAll();
    }
  }

  onSearchClick(e) {
    this.nameSearch = e;
    this.getAll();
  }
}
