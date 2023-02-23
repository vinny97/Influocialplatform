import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, from, of, EMPTY } from 'rxjs';
import { map, concatMap, finalize } from 'rxjs/operators';
import { Account } from 'src/app/@models';

// import { environment } from '@environments/environment';


// const baseUrl = `${environment.apiUrl}/accounts`;

@Injectable({ providedIn: 'root' })
export class AccountService {
    private accountSubject: BehaviorSubject<Account>;
    public account: Observable<Account>;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private http: HttpClient
    ) {
        // this.accountSubject = new BehaviorSubject<Account>(null);
        // this.account = this.accountSubject.asObservable();
    }

    // public get accountValue(): Account {
    //     return this.accountSubject.value;
    // }

    // login() {
    //     // login with facebook then authenticate with the API to get a JWT auth token
    //     this.facebookLogin()
    //         .pipe(concatMap(accessToken => this.apiAuthenticate(accessToken)))
    //         .subscribe(() => {
    //             // get return url from query parameters or default to home page
    //             const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    //             this.router.navigateByUrl(returnUrl);
    //         });
    // }

    facebookLogin() {
        // login with facebook and return observable with fb access token on success
        return from(new Promise<fb.StatusResponse>(resolve => FB.login(resolve, { scope: 'instagram_basic,instagram_content_publish,instagram_manage_insights' })))
            .pipe(concatMap(({ authResponse }) => {
                if (!authResponse) return EMPTY;
                return of(authResponse.accessToken);
            }));
    }

    // apiAuthenticate(accessToken: string) {
    //     // authenticate with the api using a facebook access token,
    //     // on success the api returns an account object with a JWT auth token
    //     return this.http.post<any>(`${baseUrl}/authenticate`, { accessToken })
    //         .pipe(map(account => {
    //             this.accountSubject.next(account);
    //             this.startAuthenticateTimer();
    //             return account;
    //         }));
    // }

    logout() {
        // revoke app permissions to logout completely because FB.logout() doesn't remove FB cookie
        FB.api('/me/permissions', 'delete', null, () => FB.logout());
        this.stopAuthenticateTimer();
        this.accountSubject.next(null);
        this.router.navigate(['/login']);
    }



    private authenticateTimeout;


    private stopAuthenticateTimer() {
        // cancel timer for re-authenticating with the api
        clearTimeout(this.authenticateTimeout);
    }
}