import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollabsRoutingModule } from './collabs-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ViewComponent } from './view/view.component';
import { ListComponent } from './list/list.component';
import { SubmitComponent } from './submit/submit.component';
import { CollabsComponent } from './collabs.component';
import { WidgetModule } from '../widgets/widget.module';
import { SubmitContentBrandComponent } from './submit-content-brand/submit-content-brand.component';
import { ResubmissionChangesComponent } from './resubmission-changes/resubmission-changes.component';

@NgModule({
  declarations: [
    ViewComponent,
    SubmitContentBrandComponent,
    ListComponent,
    SubmitComponent,
    CollabsComponent,
    ResubmissionChangesComponent,
  ],
  imports: [CommonModule, CollabsRoutingModule, WidgetModule, SharedModule],
})
export class CollabsModule {}
