import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserType } from 'src/app/@models/user/user-type';

@Component({
  selector: 'campaign-list-table',
  templateUrl: './list-table.component.html',
  styleUrls: ['./list-table.component.css'],
})
export class ListTableComponent implements OnInit {
  @Input() result;
  @Input() isMeasureList: boolean = false;
  @Input() isCreatedByVisible: boolean = false;

  UserType = UserType;
  constructor(private router: Router) {}

  ngOnInit() {
    console.log(this.result);
  }

  addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  detail(id: any) {
    this.router.navigate(['/campaigns/', id]);
  }

  viewProposals(id: any) {
    this.isMeasureList
      ? this.router.navigate(['measure/posts/', id])
      : this.router.navigate(['proposal/campaign-proposals/', id]);
  }
}
