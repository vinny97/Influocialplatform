import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-type',
  templateUrl: './type.component.html',
  styleUrls: ['./type.component.css']
})
export class TypeComponent implements OnInit {
  @Output() next = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }
  onTypeClick(type) {
    this.next.emit({type})
  }

}
