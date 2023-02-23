import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-group-card',
  templateUrl: './group-card.component.html',
  styleUrls: ['./group-card.component.css']
})
export class GroupCardComponent implements OnInit {

  @Input() group: any;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  viewGroup() {
    this.router.navigate(['/retarget/view-group/', this.group?._id])
  }

}
