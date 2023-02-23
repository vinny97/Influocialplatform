import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CampaignService } from 'src/app/@core/services/campaign.service';
import { StatService } from 'src/app/@core/services/stat.service';
import { AdminStats } from 'src/app/@models/dashboard/adminStats';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})
export class DashboardAdminComponent implements OnInit {

  result: AdminStats = null;
  isLoader: boolean = false;

  campaignResult: any = null;

  constructor(private statService: StatService, private campaignService: CampaignService, private router: Router) { }

  ngOnInit() {
    this.getStats();
    this.getAll();
  }

  getStats() {
    this.isLoader = true;
    this.statService.adminStats().subscribe((res: any) => {
      this.isLoader = false;
      // console.log(res);
      if (res.status === 200) {
        this.result = res.data.result;
      }
    })
  }


  getAll() {
    this.isLoader = true;
    this.campaignService.getAll(1, 6, 2).subscribe(res => {
      // console.log(res);
      this.isLoader = false;
      if (res.status === 200) {
        this.campaignResult = res.data.result;
      } else {
        this.campaignResult = null;
      }
    })
  }

  toAdminCampaigns() {
    this.router.navigate(['/campaigns/admin-list']);

  }

}
