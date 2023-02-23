import { Component, OnInit } from '@angular/core';
import { UserType } from '../@models';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  UserType = UserType;

  constructor() { }

  ngOnInit(): void {
  }

}
