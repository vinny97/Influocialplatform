import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BrandService } from 'src/app/@core/services/brand.service';
import { Toast } from 'src/app/@helpers/SwalToast';

@Component({
  selector: 'app-brand-create',
  templateUrl: './brand-create.component.html',
  styleUrls: ['./brand-create.component.css']
})
export class BrandCreateComponent implements OnInit {

  @ViewChild('createBrand') createBrand: TemplateRef<any>;
  @Output() onBrandChanged = new EventEmitter();


  form: FormGroup;
  isSubmit = false;

  id = null;

  constructor(
    private modalService: NgbModal,
    private brandService: BrandService,
    private fb: FormBuilder,) { }

  ngOnInit() {
    this.create();
  }

  create() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      image: ['', Validators.required]
    })
  }

  onUploadImage(imgUrl: string) {
    this.f.image.setValue(imgUrl);
  }

  get f() { return this.form.controls; }


  open() {
    this.modalService.open(this.createBrand);
  }

  close() {
    this.modalService.dismissAll();
  }

  onSubmit() {
    this.isSubmit = true;
    if (this.form.invalid) { return; }
    let sub = null;
    if (this.id) {
      sub = this.brandService.put(this.id, this.form.value)
    } else {
      sub = this.brandService.post(this.form.value)
    }
    sub.subscribe(res => {
      if (res.status === 200) {
        this.onBrandChanged.emit();
        this.close();
        this.form.reset();
        this.isSubmit = false;
        if (this.id) {
          this.id = null;
          Toast.fire({ 'title': 'Brand edit successfully', icon: "success" })
        } else {
          Toast.fire({ 'title': 'Brand created successfully', icon: "success" })
        }
      }
    });
  }

}
