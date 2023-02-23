import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/@core/services/profile.service';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css'],
})
export class PortfolioComponent implements OnInit {
  result = null;
  constructor(private profileService: ProfileService) {}

  ngOnInit() {
    this.getAll();
  }

  getAll() {
    this.profileService.getAllPortfolio().subscribe(
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
