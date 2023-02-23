import { Component, OnInit } from '@angular/core';
import { SchedulerService } from 'src/app/@core/services/scheduler.service';

@Component({
  selector: 'app-scheduled-posts',
  templateUrl: './scheduled-posts.component.html',
  styleUrls: ['./scheduled-posts.component.css'],
})
export class ScheduledPostsComponent implements OnInit {
  result: any;
  constructor(private schedulerService: SchedulerService) {}

  ngOnInit() {
    this.getAll();
  }

  getAll() {
    this.schedulerService.getAll().subscribe((response) => {
      console.log(response);
      this.result = response.data;
    });
  }
}
