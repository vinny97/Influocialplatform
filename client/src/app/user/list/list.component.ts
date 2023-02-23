import { Component, OnInit } from '@angular/core';
import { ManageUserService } from 'src/app/@core';
import { UserType } from 'src/app/@models';

@Component({
  selector: 'app-user-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  roles = UserType;
  role = 2;
  searchQuery: string = '';
  isLoader: Boolean = false;

  page = 1;
  limit = 6;

  brandId = null;
  result = null;

  constructor(private manageUserService: ManageUserService) {}

  ngOnInit(): void {
    this.getAll();
  }

  getAll() {
    this.isLoader = true;
    this.manageUserService
      .getAll(this.page, this.limit, this.role, this.searchQuery)
      .subscribe((res) => {
        this.isLoader = false;
        if (res.status === 200) {
          this.result = res.data.result;
        } else {
          this.result = null;
        }
      });
  }

  onTypeClick(e) {
    if (e) {
      this.role = e;
      this.getAll();
    }
  }

  onClickPage(e) {
    if (e) {
      this.page = e.page;
      this.limit = e.limit;
      this.getAll();
    }
  }
  onSearchClick(e) {
    console.log(e);
    this.searchQuery = e;
    this.getAll();
  }
}
