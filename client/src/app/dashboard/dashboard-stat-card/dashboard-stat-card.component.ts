import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-stat-card',
  templateUrl: './dashboard-stat-card.component.html',
  styleUrls: ['./dashboard-stat-card.component.css']
})
export class DashboardStatCardComponent implements OnInit {

  @Input() label: string;
  @Input() value: number;
  @Input() icon: string;

  constructor() { }

  ngOnInit() {
  }

}
