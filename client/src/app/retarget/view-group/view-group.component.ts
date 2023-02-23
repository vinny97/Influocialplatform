import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupService } from 'src/app/@core';

@Component({
  selector: 'app-view-group',
  templateUrl: './view-group.component.html',
  styleUrls: ['./view-group.component.css']
})
export class ViewGroupComponent implements OnInit {

  groupID = null;
  result = null;
  constructor(private route: ActivatedRoute, private groupService: GroupService, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.groupID = params['groupID'];
      if (this.groupID) {
        this.getData();
      }
    });
  }

  getData() {
    this.groupService.getGroup(this.groupID).subscribe(res => {
      if (res.status === 200) {
        this.result = res.data.group;
      } else {
        this.result = null;
      }
    })

  }

  addMembers() {
    this.router.navigate(['/retarget/past']);
  }

  onMemberDeleted(e: any) {
    if (e) {
      this.getData();
    }
  }

}
