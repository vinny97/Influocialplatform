import { Component, OnInit, ViewChild } from '@angular/core';
import { GroupService, UserService } from 'src/app/@core';
import { CollaborationsService } from 'src/app/@core/services/collaborations.service';
import { CreateGroupComponent } from 'src/app/widgets/create-group/create-group.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-past',
  templateUrl: './past.component.html',
  styleUrls: ['./past.component.css']
})
export class PastComponent implements OnInit {

  @ViewChild(CreateGroupComponent) CreateGroup: CreateGroupComponent;


  page = 1;
  limit = 6;
  result = null;
  isLoader: boolean = false;
  collaborations: any = [];
  brand: any;

  constructor(private groupService: GroupService, private userService: UserService, private collaborationsService: CollaborationsService) { }

  ngOnInit(): void {
    this.brand = this.userService.getCurrentUser()._id;
    this.getAll();
    this.getCollaborations();
    console.log(this.userService.getCurrentUser());
  }


  getAll() {
    this.isLoader = true;
    this.groupService.getCollaborators(this.page, this.limit).subscribe(res => {
      this.isLoader = false;
      if (res.status === 200) {
        this.result = res.data.result;
        console.log(this.result)
      }
      else {
        this.result = null;
      }
    })
  }
  getCollaborations() {
    this.collaborationsService.getCollaborations(this.brand).subscribe((res) => {
      console.log(res);
      if (res.status === 200) {
        console.log(res.data.result);
        this.collaborations = res.data.result;
      }
    }, (err) => {
      Swal.fire(err.message, '', 'error');
      console.log(err);
    })
  }

  onClickPage(e) {
    if (e) {
      this.page = e.page;
      this.limit = e.limit;
      this.getAll();
    }
  }
  // opens create group modal
  newGroup() {
    this.CreateGroup.open();
  }

}
