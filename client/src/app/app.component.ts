import { Component } from '@angular/core';
import { NgxPermissionsService } from 'ngx-permissions';
import { UserService } from './@core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(
    private permissionsService: NgxPermissionsService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.populate();
    this.userService.currentUser.subscribe((user) => {
      if (user && user.role) {
        console.log('role of user ', user.role);
        this.permissionsService.loadPermissions([user.role]);
      } else {
        console.log(' user ', user);
        this.permissionsService.flushPermissions();
      }
    });
  }
}
