import { UserService } from 'src/app/@core';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { take } from 'rxjs/operators';
import { JwtService } from './jwt.service';

@Injectable()
export class NoAuthGuard implements CanActivate {
  constructor(
    private userService:UserService,
    private router: Router,
    private jwtService: JwtService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {

    if (this.jwtService.getToken()) {
      let user=this.userService.getCurrentUser();
      console.log('**',user);

      if(user.isEmailVerified){
        this.router.navigate(['/discover']);
      }else{
        this.userService.purgeAuth();
        this.router.navigate(['/auth/verify']);
      }
      return false;
    }
    return true;
  }
}
