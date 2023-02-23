import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'campaign-type-select',
  templateUrl: './type-select.component.html',
  styleUrls: ['./type-select.component.css']
})
export class TypeSelectComponent implements OnInit {

  @Input() link: any = null;
  constructor(private router: Router) { }

  ngOnInit() {
  }


  navigateToLink(type: number) {
    this.router.navigate([this.link, type]);
  }

}
