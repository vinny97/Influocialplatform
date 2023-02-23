import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-image-carousal',
  templateUrl: './image-carousal.component.html',
  styleUrls: ['./image-carousal.component.css'],
})
export class ImageCarousalComponent implements OnInit {
  @Input() images: any;
  appURL = environment.apiUrl;
  currentRoute: string;

  constructor(private router: Router) {
    console.log(this.images);
  }

  ngOnInit() {
    this.router.events.subscribe((res) => {
      this.currentRoute = this.router.url.split('/')[1];
    });
  }
}
