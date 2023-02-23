import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-metrics-card',
  templateUrl: './metrics-card.component.html',
  styleUrls: ['./metrics-card.component.css']
})
export class MetricsCardComponent implements OnInit {

  @Input() label: string;
  @Input() cardValue: string;
  @Input() showPercentage: boolean = false;
  @Input() showCurrency: boolean = false;
  constructor() { }

  ngOnInit() {
  }

}
