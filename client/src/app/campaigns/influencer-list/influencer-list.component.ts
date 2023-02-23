import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CampaignService } from 'src/app/@core';
import { CampaignType } from 'src/app/@models/campaign/campaign-type';
import { CAMPAIGN_CATEGORIES } from 'src/app/@constants';

@Component({
  selector: 'app-influencer-list',
  templateUrl: './influencer-list.component.html',
  styleUrls: ['./influencer-list.component.css'],
})
export class InfluencerListComponent implements OnInit {
  CAMPAIGN_TYPE = CampaignType;

  result: any = null;
  type: number = 1;
  page: number = 1;
  limit: number = 6;
  status: number = 2;
  isFavorite: any = 0;
  nameSearch: string = '';
  toggle = 0;
  selectedCategory: number = null;
  searchQuery: string = '';
  isLoader: boolean = false;
  subscribtion: Subscription;
  categories = CAMPAIGN_CATEGORIES;
  constructor(
    private campaignService: CampaignService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAll();
  }

  onTypeClick(type) {
    this.toggle = type;
    console.log(this.toggle);
    //for active and Fav button
    if (type == 0) {
      this.isFavorite = 0;
      this.getAll();
    } else {
      this.isFavorite = 1;
      this.getAll();
    }
  }
  toggleCampaign(campaignType) {
    if (campaignType === 1) {
      this.type = 1;
    } else {
      this.type = 2;
    }
    this.getAll();
  }
  getAll() {
    this.subscribtion = this.campaignService
      .getAll(
        this.page,
        this.limit,
        this.status,
        this.nameSearch,
        this.type,
        this.selectedCategory,
        this.isFavorite
      )
      .subscribe((res) => {
        // console.log(res);
        if (res.status === 200) {
          console.log("Campaigns List component res", res);

          this.result = res.data.result;
          console.log(this.result);
        } else {
          this.result = null;
        }
      });
  }

  onClickPage(e) {
    if (e) {
      this.page = e.page;
      this.limit = e.limit;
      this.getAll();
    }
  }

  detail(id: any) {
    this.router.navigate(['/campaigns/', id]);
  }
  onSearchClick() {
    this.nameSearch = this.searchQuery;
    this.getAll();
  }

  isEmpty() {
    if (this.searchQuery == '' || this.searchQuery == null) {
      this.nameSearch = this.searchQuery;
      this.getAll();
    }
  }

  toggleFavorite(e) {
    if (e.isFavorite) {
      this.isFavorite = 0;
    } else {
      this.isFavorite = 1;
    }
    this.campaignService
      .updateCampaign(e._id, { isFavorite: this.isFavorite })
      .subscribe((response) => {
        console.log(response);
        if (response.status === 200) {
          this.isFavorite = null;
          this.getAll();
        }
      });
  }
}
