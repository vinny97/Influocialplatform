import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GroupService } from 'src/app/@core';
import { Toast } from 'src/app/@helpers/SwalToast';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-remove-member',
  templateUrl: './remove-member.component.html',
  styleUrls: ['./remove-member.component.css']
})
export class RemoveMemberComponent implements OnInit {

  @Input() groupID: any;
  @Input() memberID: any;
  @Output() onMemberRemoved = new EventEmitter();

  constructor(private groupService: GroupService) { }

  ngOnInit() {
  }

  updateGroup() {

  }

  update() {
    this.groupService.updateGroup(this.groupID, { removeMember: this.memberID }).subscribe(res => {
      if (res.status === 200) {
        Toast.fire({ title: 'Member Removed', icon: 'success' });
        this.onMemberRemoved.emit(this.memberID);
      }
    })
  }

  removeMember() {
    Swal.fire({
      title: 'Do you want to remove member?',
      showCancelButton: true,
      confirmButtonText: `Remove`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.update();
      }
    })

  }

}
