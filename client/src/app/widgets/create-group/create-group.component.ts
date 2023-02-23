import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GroupService, } from 'src/app/@core';
import { Toast } from 'src/app/@helpers/SwalToast';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.css']
})
export class CreateGroupComponent implements OnInit {

  @ViewChild('content') content: TemplateRef<any>;
  @Output() onSubmit = new EventEmitter();

  form: FormGroup = null;
  isSubmit = false;

  constructor(private modalService: NgbModal, public fb: FormBuilder, private groupService: GroupService) { }

  ngOnInit(): void {
    this.create();
  }

  create() {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', [Validators.required, Validators.maxLength(150)]],
    });
  }

  get f() { return this.form.controls; }

  open() {
    this.modalService.open(this.content, { size: 'lg', centered: true });
  }

  close() {
    this.isSubmit = false;
    this.form.reset();
    this.modalService.dismissAll();
  }

  onAddGroup() {
    this.isSubmit = true;
    if (this.form.invalid) { return; }
    this.groupService.createGroup(this.form.value).subscribe(res => {
      if (res.status === 200) {
        this.onSubmit.emit("group created");
        this.close();
        Toast.fire({ title: 'Group Created', icon: 'success' });
      } else {
        // this.result = null;
      }
    })
  }

}
