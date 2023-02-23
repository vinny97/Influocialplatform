import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { GroupService } from 'src/app/@core';
import { CreateGroupComponent } from 'src/app/widgets/create-group/create-group.component';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {

  @ViewChild(CreateGroupComponent) CreateGroup: CreateGroupComponent;

  page = 1;
  limit = 6;
  result = null;
  isLoader: boolean = false;

  constructor(private groupService: GroupService) { }

  ngOnInit(): void {
    this.getAll();
  }


  getAll() {
    this.isLoader = true;
    this.groupService.getAll(this.page, this.limit).subscribe(res => {
      console.log(res);
      this.isLoader = false;
      if (res.status === 200) {
        this.result = res.data.result;
      }
      else {
        this.result = null;
      }
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

  onAddGroup(e: any) {
    if (e) { this.getAll(); }
  }

}
