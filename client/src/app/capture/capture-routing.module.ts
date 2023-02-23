import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MediaPostComponent } from './media-post/media-post.component';
import { ScheduledPostsComponent } from './scheduled-posts/scheduled-posts.component';

const routes: Routes = [
  { path: '', component: MediaPostComponent },
  { path: ':proposalID', component: MediaPostComponent },
  { path: 'scheduled-posts/list', component: ScheduledPostsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CaptureRoutingModule {}
