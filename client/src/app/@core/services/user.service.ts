import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, ReplaySubject, of } from 'rxjs';

import { ApiService } from './api.service';
import { JwtService } from './jwt.service';

import { map, distinctUntilChanged, catchError } from 'rxjs/operators';

@Injectable()
export class UserService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser = this.currentUserSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  constructor(private apiService: ApiService, private jwtService: JwtService) {}
  contextPopulate() {
    // If JWT detected, attempt to get & store user's info
    if (this.jwtService.getToken()) {
      console.log('this.jwtService.getToken()', this.jwtService.getToken());
      return this.apiService.post('/user/context').pipe(
        map((res) => {
          // console.log('res.data.user', res)
          this.setAuth(res.data.user);
          return res.data.user;
        }),
        catchError((e) => {
          this.purgeAuth();
          return of(null);
        })
      );
    } else {
      return of(null);
    }
  }
  // Verify JWT in localstorage with server & load user's info.
  // This runs once on application startup.
  populate() {
    // If JWT detected, attempt to get & store user's info
    if (this.jwtService.getToken()) {
      this.apiService.post('/user/context').subscribe(
        (data) => this.setAuth(data.data.user),
        (err) => this.purgeAuth()
      );
    } else {
      // Remove any potential remnants of previous auth states
      this.purgeAuth();
    }
  }

  setAuth(user: any) {
    // Save JWT sent from server in localstorage
    console.log(':::User::', user);
    this.jwtService.saveToken(user.token);
    // Set current user data into observable
    this.currentUserSubject.next(user);
    // Set isAuthenticated to true
    this.isAuthenticatedSubject.next(true);
  }

  purgeAuth() {
    // Remove JWT from localstorage
    this.jwtService.destroyToken();
    // Set current user to an empty object
    this.currentUserSubject.next({} as any);
    // Set auth status to false
    this.isAuthenticatedSubject.next(false);
  }

  attemptAuth(credentials): Observable<any> {
    return this.apiService.post('/users/login', { user: credentials }).pipe(
      map((data) => {
        this.setAuth(data.data.user);
        console.log("data-", data);
        return data;
      })
    );
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }
  verify(user: any): Observable<any> {
    return this.apiService.post('/users/verify', { user });
  }
  verifyResend(user: any): Observable<any> {
    return this.apiService.post('/users/verify/resend', { user });
  }
  resetPassword(user: any): Observable<any> {
    return this.apiService.post('/users/reset/password', { user });
  }

  getProfile(): Observable<any> {
    return this.apiService.post('/user/profile');
  }

  getUserById(userID): Observable<any> {
    return this.apiService.get(`/users/find/${userID}`);
  }

  // getAll(page = 1, limit = 6, role = null): Observable<any> { return this.apiService.get(`/user/all/?page=${page}&limit=${limit}&role=${role}`); };
  signUp(user: any): Observable<any> {
    console.log("sending user-", {user});
    return this.apiService.post('/users/register', { user }).pipe(
      map((data) => {
        console.log("Data from signup api- ", data);
        return data;
      })
    );
  }

  // Update the user on the server (email, pass, etc)
  update(user): Observable<any> {
    return this.apiService.post('/user', { user }).pipe(
      map((res) => {
        // Update the currentUser observable
        this.currentUserSubject.next(res.data.user);
        return res;
      })
    );
  }

  updateInstagramInfo(userID, data): Observable<any> {
    return this.apiService.put(`/users/instagram/${userID}`, {
      instagram: data,
    });
  }

  // if admin Updates the user on the server (status etc)
  updateUserByAdmin(id, user): Observable<any> {
    return this.apiService.put(`/users/${id}`, { user });
  }

  logout() {
    this.purgeAuth();
  }
}
