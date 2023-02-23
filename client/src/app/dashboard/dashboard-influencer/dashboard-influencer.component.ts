import { Component, OnInit } from '@angular/core';
import { StatService } from 'src/app/@core/services/stat.service';
import { InfluencerStats } from 'src/app/@models/dashboard/influencerStats';

@Component({
  selector: 'app-dashboard-influencer',
  templateUrl: './dashboard-influencer.component.html',
  styleUrls: ['./dashboard-influencer.component.css']
})
export class DashboardInfluencerComponent implements OnInit {

  result: InfluencerStats = null;
  isLoader: boolean = false;

  constructor(private statService: StatService,) { }

  ngOnInit() {
    this.getStats();
  }

  getStats() {
    this.isLoader = true;
    this.statService.influencerStats().subscribe((res: any) => {
      this.isLoader = false;
      console.log(res);
      if (res.status === 200) {
        this.result = res.data.result;
      }
    })
  }



}
