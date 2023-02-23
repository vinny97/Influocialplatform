import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BrandService } from 'src/app/@core/services/brand.service';
import { Toast } from 'src/app/@helpers/SwalToast';
import Swal from 'sweetalert2';
import { BrandCreateComponent } from '../brand-create/brand-create.component';

@Component({
  selector: 'app-brand-list',
  templateUrl: './brand-list.component.html',
  styleUrls: ['./brand-list.component.css'],
})
export class BrandListComponent implements OnInit {
  @ViewChild(BrandCreateComponent) createBrand: BrandCreateComponent;

  @Input() isMeasure: boolean = false;

  result = null;
  isLoader = false;

  constructor(private brandService: BrandService, private router: Router) {}

  ngOnInit(): void {
    this.get();
  }

  get() {
    this.isLoader = true;
    this.brandService.get({}).subscribe((res) => {
      if (res.status === 200) {
        this.isLoader = false;
        this.result = res.data.result;
      }
    });
  }

  onCreateClick() {
    this.createBrand.form.reset();
    this.createBrand.open();
  }

  onEditClick(brand) {
    this.createBrand.id = brand._id;
    this.createBrand.form.patchValue(brand);
    this.createBrand.open();
  }

  brandsUpdated(e) {
    this.get();
  }

  onViewCampaignsNavigation(brandID) {
    this.isMeasure
      ? this.router.navigate([`measure/${brandID}/campaigns`])
      : this.router.navigate([`brands/${brandID}/campaigns`]);
  }

  onDeleteClick(brand) {
    Swal.fire({
      title: 'Are you sure?',
      text: `You want to Delete ${brand.name}!`,
      icon: 'warning',
      confirmButtonText: 'yes Delete It',
      showCancelButton: true,
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('Inside confirm');
        this.brandService.delete(brand._id).subscribe((res) => {
          if (res.status === 200) {
            Toast.fire({
              title: 'Brand deleted successfully',
              icon: 'success',
            });
            this.get();
          }
        });
      }
    });
  }
}
