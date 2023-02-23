import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentsComponent } from './payments.component';
import { PaymentsRoutingModule } from './payments-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ViewComponent } from './view/view.component';

@NgModule({
  imports: [CommonModule, PaymentsRoutingModule, SharedModule],
  declarations: [PaymentsComponent, ViewComponent],
})
export class PaymentsModule {}
