import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { BrandsRoutingModule } from './brands-routing.module';
import { BrandListComponent } from './brand-list/brand-list.component';
import { BrandCreateComponent } from './brand-create/brand-create.component';



@NgModule({
  declarations: [BrandListComponent, BrandCreateComponent],
  imports: [
    CommonModule,
    BrandsRoutingModule,
    SharedModule
  ],
  exports: [BrandListComponent]

})
export class BrandsModule { }
