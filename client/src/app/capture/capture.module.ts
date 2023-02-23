import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaPostComponent } from './media-post/media-post.component';
import { SharedModule } from '../shared/shared.module';
import { CaptureRoutingModule } from './capture-routing.module';
import { ScheduledPostsComponent } from './scheduled-posts/scheduled-posts.component';

@NgModule({
  imports: [CommonModule, SharedModule, CaptureRoutingModule],
  declarations: [MediaPostComponent, ScheduledPostsComponent],
})
export class CaptureModule {}
