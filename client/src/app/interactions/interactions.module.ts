import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InteractionsComponent } from './interactions.component';
import { InteractionsRoutingModule } from './interactions-routing.module';

@NgModule({
  imports: [
    CommonModule,
    InteractionsRoutingModule
  ],
  declarations: [InteractionsComponent]
})
export class InteractionsModule { }
