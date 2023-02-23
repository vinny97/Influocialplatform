import { EventEmitter, OnInit, Output } from '@angular/core';
import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import {
  filter,
  debounceTime,
  distinctUntilChanged,
  tap,
} from 'rxjs/operators';
import { CAMPAIGN_STATUS } from 'src/app/@constants';

@Component({
  selector: 'app-user-list-filter',
  templateUrl: './user-list-filter.component.html',
  styleUrls: ['./user-list-filter.component.css'],
})
export class UserListFilterComponent implements OnInit {
  role = 2;

  @Output() onFilterChange = new EventEmitter();
  @Output() onSearchClicked = new EventEmitter();
  searchQuery: string = '';
  status = CAMPAIGN_STATUS;
  constructor() {}

  onRoleClick(role) {
    this.role = role;
    this.onFilterChange.emit(this.role);
  }

  ngOnInit(): void {}

  onSearchClick() {
    this.onSearchClicked.emit(this.searchQuery);
  }

  isEmpty() {
    if (this.searchQuery == '' || this.searchQuery == null) {
      this.onSearchClicked.emit('');
    }
  }
}
