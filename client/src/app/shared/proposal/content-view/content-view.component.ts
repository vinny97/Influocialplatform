import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-content-view',
  templateUrl: './content-view.component.html',
  styleUrls: ['./content-view.component.css']
})
export class ContentViewComponent implements OnInit {

  @Input() result: any;
  constructor() {
    console.log(this.result)
  }

  ngOnInit() {
  }

}
