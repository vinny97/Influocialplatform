import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService, UserService } from '../../services';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  public isTreeCollapsed = true;
  userHeaderService: Subscription = new Subscription();
  currentUser = null;
  notifications: any;
  constructor(
    private notificationService: NotificationService,
    private userService: UserService,
    private router: Router,
    private _location: Location
  ) {
    this.userService.currentUser.subscribe((u) => (this.currentUser = u));
  }

  ngOnInit(): void {
    this.userService.currentUser.subscribe((user) => {
      console.log(user);
      if (user) {
        this.getNotifications();
        this.notificationService
          .getEvent(user._id)
          .subscribe((res) => this.getNotifications());
      }
      if(user.instagram){
        console.log("instagram id-"+user.instagram.profileInfo.username);
      }
    });
  }

  sidebarLgCollapse() {
    const element = document.getElementsByTagName('body')[0];
    if (element.classList.contains('sidebar-xs')) {
      element.classList.remove('sidebar-xs');
    } else {
      element.classList.add('sidebar-xs');
    }
  }

  getNotifications() {
    this.notificationService.getNotification().subscribe((response) => {
      this.notifications = response.data.result.docs;
      console.log("Notificatonis", this.notifications);
    });
  }
  sidebarSmCollapse() {
    const element = document.getElementsByTagName('body')[0];
    if (element.classList.contains('sidebar-mobile-main')) {
      element.classList.remove('sidebar-mobile-main');
    } else {
      element.classList.add('sidebar-mobile-main');
    }
  }
  onLogoutClick() {
    this.userService.logout();
    this.router.navigate(['auth']);
  }

  ngOnDestroy() {
    this.userHeaderService.unsubscribe();
  }

  goBack() {
    this._location.back();
  }
}
