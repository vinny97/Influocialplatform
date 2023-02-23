import { Component, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/@core/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-insta-tabs',
  templateUrl: './insta-tabs.component.html',
  styleUrls: ['./insta-tabs.component.css'],
})
export class InstaTabsComponent implements OnInit {
  @Input() createdBy;
  activeIndex: number = 1;
  longLiveToken: any = null;
  pageID: any = null;
  isLoader = false;
  influencerId: any;
  constructor(private userService: UserService) {}

  ngOnInit() {
    console.log('creator_________ID', this.createdBy);
    if (this.createdBy) {
      this.isLoader = true;

      this.userService.getUserById(this.createdBy).subscribe((response) => {
        console.log(response);
        if (response.data.user.instagram == null) {
          Swal.fire('User has not connected Instagram yet', '', 'error');
          this.isLoader = false;
        } else {
          //page Id and accesstoken
          this.longLiveToken =
            response?.data?.user?.instagram?.longLiveAccessToken;
          this.pageID = response?.data?.user?.instagram?.pageId;
          console.log(this.longLiveToken, this.pageID);
          this.influencerId = response?.data?.user?._id;
          this.isLoader = false;
        }
      });
    }
  }

  toggleClass(i: number): void {
    if (this.activeIndex == i) {
      this.activeIndex = -i;
    } else {
      this.activeIndex = i;
    }
  }
}
