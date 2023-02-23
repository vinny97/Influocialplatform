import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/@core';
import { UserStatus, UserType } from 'src/app/@models';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-list-table',
  templateUrl: './user-list-table.component.html',
  styleUrls: ['./user-list-table.component.css']
})
export class UserListTableComponent implements OnInit {

  @Input() result;

  isLoader: boolean = false;
  selectedUser = null;

  roles = UserType;
  STATUS = UserStatus;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
  }

  update() {
    this.isLoader = true;
    this.userService.updateUserByAdmin(this.selectedUser._id, { status: this.selectedUser.status === 1 ? 2 : 1 }).subscribe(res => {
      this.isLoader = false;
      if (res.status === 200) {
        // finds and updates status of user
        var foundIndex = this.result.docs.findIndex(x => x._id === this.selectedUser._id);
        this.result.docs[foundIndex].status = this.selectedUser.status === 1 ? 2 : 1;

        Swal.fire(`User ${this.selectedUser.status === 1 ? "Active" : "Blocked"}`, '', 'success');
        this.selectedUser = null;
      }
      else {
        this.selectedUser = null;
        Swal.fire('Error occurred', '', 'error');
      }
    })
  }

  updateStatus(user) {
    this.selectedUser = user;
    Swal.fire({
      title: `Do you want to ${this.selectedUser.status === 1 ? "Block" : "Active"} user?`,
      showCancelButton: true,
      confirmButtonText: `Yes`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.update();
      }
    })
  }

  viewProfile(id) {
    this.router.navigate(['users/profile/', id]);
  }


}
