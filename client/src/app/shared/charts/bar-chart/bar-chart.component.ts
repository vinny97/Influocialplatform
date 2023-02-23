import { Component, Input, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {


  @Input() labels: string[] = [];
  @Input() values: number[] = [];
  @Input() valuesLabel: string;

  public barChartOptions: ChartOptions = {
    responsive: true,
  };

  public chartColors: any[] = [
    {
      backgroundColor: ["#2b5aff", "#2b5aff", "#2b5aff", "#2b5aff", "#2b5aff",]
    }];

  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] = [];

  constructor() { }

  ngOnInit() {
    this.barChartLabels = this.labels;
    this.barChartData = [{ data: this.values, label: this.valuesLabel }]
  }

}
