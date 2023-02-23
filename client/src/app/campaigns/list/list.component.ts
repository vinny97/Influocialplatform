import { Component, Input, OnInit } from '@angular/core';
import { BrandService } from './../../@core/services/brand.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-campaign-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  @Input() isMeasure: boolean = false;
  status = 2;
  isLoader: Boolean = false;

  page = 1;
  limit = 6;

  type: number = 0;

  brandId = null;
  result = null;
  nameSearch: string = '';

  constructor(
    private brandService: BrandService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.brandId = params['brandId'];
      this.get();
    });
  }

  get() {
    this.isLoader = true;
    this.brandService.getCampaignsByBrandId(this.brandId, this.page, this.limit, this.status, this.nameSearch, this.type).subscribe(res => {
      this.isLoader = false;
      console.log("Campaigns Response", res);  
      if (res.status === 200) {
        this.result = res.data.result;
        console.log("this.result =>", this.result);
      }
      else {
        this.result = null;
      }
    })

  }

  onTypeClick(e) {
    if (e) {
      this.status = e;
      this.get();
    }
  }

  onClickPage(e) {
    if (e) {
      this.page = e.page;
      this.limit = e.limit;
      this.get();
    }
  }

  campaignTypeChange(e) {
    if (e || e === 0) {
      this.type = e;
      this.get();
    }
  }

  onSearchClick(e) {
    this.nameSearch = e;
    this.get();
  }
}
