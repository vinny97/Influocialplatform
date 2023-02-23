import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GroupService } from 'src/app/@core';
import { Toast } from 'src/app/@helpers/SwalToast';

@Component({
  selector: 'app-add-group-member',
  templateUrl: './add-group-member.component.html',
  styleUrls: ['./add-group-member.component.css']
})
export class AddGroupMemberComponent implements OnInit {

  userID: any = null;


  form: FormGroup = null;
  isSubmit = false;

  @ViewChild('content') content: TemplateRef<any>;
  @Output() onSubmit = new EventEmitter();

  result: any = null;

  constructor(private modalService: NgbModal, public fb: FormBuilder, private groupService: GroupService, private router: Router) { }


  ngOnInit(): void {
    this.create();
  }

  create() {
    this.form = this.fb.group({
      selectedGroup: ['', [Validators.required]],
    });
  }

  get f() { return this.form.controls; }


  open(id) {
    this.userID = id;
    if (this.userID) {
      this.getGroups();
    }
    this.modalService.open(this.content, { size: 'lg', centered: true });
  }

  close() {
    this.form.reset();
    this.isSubmit = false;
    this.modalService.dismissAll();
  }

  getGroups() {
    this.groupService.getList(this.userID).subscribe(res => {
      console.log(res);

      if (res.status === 200) {
        this.result = res.data.result.docs;
      } else {
        // this.result = null;
      }
    })
  }

  onAdd() {
    this.isSubmit = true;
    if (this.form.invalid) { return; }
    this.groupService.updateGroup(this.f.selectedGroup.value, { member: this.userID }).subscribe(res => {
      console.log(res);
      if (res.status === 200) {
        Toast.fire({ title: 'Member Added', icon: 'success' });
        this.router.navigate(['/retarget/view-group/', this.f.selectedGroup.value]);
        this.close();
      }
    })
  }

}
