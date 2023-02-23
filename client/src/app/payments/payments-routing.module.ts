import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentsComponent } from './payments.component';
import { ViewComponent } from './view/view.component';

const routes: Routes = [
  { path: '', component: PaymentsComponent },
  { path: 'view/:transactionID', component: ViewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentsRoutingModule {}
