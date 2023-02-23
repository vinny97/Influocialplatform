import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserType } from 'src/app/@models';
import { ChatService } from '../../services/chat.service';
import { InstagramService } from '../../services/instagram.service';
import { UserService } from '../../services/user.service';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  UserType = UserType;
  chatCount = null;
  currentUser: any;
  currentInstagramUser: any;
  public isMenuCollapsed = true;
  public isSettingCollapsed = true;
  userSidebarService: Subscription = new Subscription();
  constructor(
    private router: Router,
    private chatService: ChatService,
    private userService: UserService
  ) {
    this.userSidebarService = router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.sidebarSmCollapse();
      }
    });
  }
  ngOnInit(): void {
    this.userService.currentUser.subscribe((u) => {
      this.currentUser = u;
      if (u) {
        console.log('inside');
        console.log("Sidebar user object-" + u);
      }
      if(u.instagram){
        console.log("Sidebar instagram username-"+u.instagram.profileInfo.username);
      }
    });
    this.unreadCount();
  }

  sidebarSmCollapse() {
    const element = document.getElementsByTagName('body')[0];

    element.classList.remove('sidebar-mobile-main');
  }

  unreadCount() {
    console.log(this.currentUser?._id);

    this.chatService
      .getConversationEvent(this.currentUser?._id)
      .subscribe((res) => {
        this.chatService.unreadCount().subscribe((res) => {
          if (res.status == 200) {
            this.chatCount = res.data.count;
          }
        });
      });
  }
  ngOnDestroy() {
    this.userSidebarService.unsubscribe();
  }
}
