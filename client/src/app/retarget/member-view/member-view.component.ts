import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CollaborationsService } from 'src/app/@core/services/collaborations.service';
import { InstaService } from 'src/app/@core/services/insta.service';
import Swal from 'sweetalert2';
import { AddGroupMemberComponent } from '../add-group-member/add-group-member.component';


@Component({
  selector: 'app-member-view',
  templateUrl: './member-view.component.html',
  styleUrls: ['./member-view.component.css']
})
export class MemberViewComponent implements OnInit {
  @ViewChild(AddGroupMemberComponent) AddGroupMember: AddGroupMemberComponent;
  @ViewChild('content') content: ElementRef<any>;
  rating = 0;
  @Input() groupID: any;
  @Input() member: any;
  @Input() type: number;
  @Output() onSuccess: EventEmitter<any> = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter();
  isLoader: boolean;
  instaProfileInfo: any;
  constructor(private instaService: InstaService, private collaborationsService: CollaborationsService, private modalService: NgbModal) { }

  ngOnInit() {
    console.log(this.member)
  }

  addMember(id) {
    this.AddGroupMember.open(id);
  }

  memberRemoved(e: any) {
    if (e) {
      this.onDelete.emit(e);
    }
  }

  open() {
    this.modalService.open(this.content, { size: 'md', centered: true })
  }
  rate() {
    console.log(this.rating)
    this.collaborationsService.rate({ rating: this.rating, _id: this.member._id, influencer: this.member.influencer._id }).subscribe((res) => {
      if (res.status === 200) {
        this.modalService.dismissAll();
        this.onSuccess.emit(true)
      }
    }, (err) => {
      Swal.fire(err.message, '', 'error');
    })
  }


}
