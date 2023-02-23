import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-insta-post',
  templateUrl: './insta-post.component.html',
  styleUrls: ['./insta-post.component.css'],
})
export class InstaPostComponent implements OnInit {
  @Input() post: any;
  constructor() {}

  ngOnInit() {}

  viewPost(url) {
    window.open(url, '_blank');
  }
}
