import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { countries } from '../@constants';
import {
  INFLUENCERS_CATEGORIES,
  INFLUENCERS_FOLLOWERS_RANGE,
} from '../@constants/influencers-categories';
import { CollaborationsService } from '../@core/services/collaborations.service';
import _ from 'lodash';

@Component({
  selector: 'app-discovery',
  templateUrl: './discovery.component.html',
  styleUrls: ['./discovery.component.css'],
})
export class DiscoveryComponent implements OnInit {
  rows = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  filters = { engagement: 100 };
  engagements = [
    { name: 10 },
    { name: 20 },
    { name: 30 },
    { name: 40 },
    { name: 50 },
    { name: 60 },
    { name: 70 },
    { name: 80 },
    { name: 90 },
    { name: 100 },
  ];
  influencers_categories = INFLUENCERS_CATEGORIES;
  influencers_followers_range = INFLUENCERS_FOLLOWERS_RANGE;
  influencers_countries = countries;
  influencers = [];
  search: any;
  category = '';
  followers: any = 0;
  isLoading: boolean = false;
  @ViewChild('content') content!: TemplateRef<any>;
  engagement: any = 0;
  location: any = '';
  selectedInfluencer: any;
  constructor(
    private collaborationsService: CollaborationsService,
    config: NgbModalConfig,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.getInfluencers();
  }

  getInfluencers() {
    this.isLoading = true;
    this.collaborationsService.getInfluencers().subscribe(
      (response) => {
        console.log(response);
        if (response.status === 200) {
          if (response.data.length > 0) {
            response.data.forEach((influencer: any) => {
              influencer.profilePicture =
                environment.file_url + '/' + influencer.profilePicture;
              this.influencers.push(influencer);
            });
          }
          this.isLoading = false;

          console.log(this.influencers);
          localStorage.setItem('influencers', JSON.stringify(this.influencers));
        }
      },
      (err) => {
        this.isLoading = false;
      }
    );
  }
  filterByEngagement(engagement: any) {
    console.log(engagement);
    if (engagement === undefined) {
      this.engagement = 0;
    } else {
      this.engagement = engagement.name;
    }
    this.filterInfluencers();
  }
  filterByFollowers(followers: any) {
    if (followers === undefined) {
      this.followers = 0;
    } else {
      this.followers = followers.value;
    }
    this.filterInfluencers();
  }
  filterByLocation(location: any) {
    if (location === undefined) {
      this.location = '';
    } else {
      this.location = location.name;
    }
    this.filterInfluencers();
  }
  filterByCategory(category: any) {
    if (category === undefined) {
      this.category = '';
    } else {
      this.category = category.name;
    }
    this.filterInfluencers();
  }

  resetFilters() {
    this.influencers = JSON.parse(localStorage.getItem('influencers'));
  }
  filterInfluencers() {
    let influencers = [];
    let _influencers = [];
    influencers = JSON.parse(localStorage.getItem('influencers'));

    if (this.engagement != 0) {
      console.log('inside engagement');
      influencers = influencers.filter(
        (influencer: any) => influencer.reach >= this.engagement
      );
    }

    if (this.followers != 0) {
      console.log('inside follower');
      console.log(this.followers);
      influencers = influencers.filter(
        (influencer: any) => influencer.follower >= this.followers
      );
    }
    if (this.location != '') {
      console.log('inside location');
      influencers = influencers.filter(
        (influencer: any) => influencer.country == this.location
      );
    }
    if (this.category != '') {
      console.log('inside category');
      influencers = influencers.filter(
        (influencer: any) => influencer.category == this.category
      );
    }
    console.log(influencers);
    this.influencers = influencers;
  }

  onChange(e: any, type: string) {
    console.log(e);
    let influencers = localStorage.getItem('influencers') as any;
    console.log(influencers);
    if (type === 'category') {
      this.category = e.name;
      influencers = influencers.filter((influencer) => {
        return influencer.profile_data.category_name == this.category;
      });
    }
    if (type === 'followers') {
      this.followers = e.value;
      console.log(this.followers);
      influencers = influencers.filter((influencer) => {
        console.log(
          influencer.profile_data.total_follower,
          +'    ' + this.followers
        );
        return influencer.profile_data.total_followers <= this.followers;
      });
    }
    this.influencers = influencers;
  }

  onFilterChange(e: any, type: string) {
    let influencers = localStorage.getItem('influencers');
    console.log(influencers);
  }

  openModal(influencer: any) {
    this.selectedInfluencer = influencer;
    this.modalService.open(this.content, { size: 'xl', centered: true });
  }
}
