import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, from } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LoginOptions } from 'ngx-facebook';

@Injectable({
  providedIn: 'root',
})
export class InstagramService {
  USER_ID = 17841441871512114;

  ACCESS_TOKEN =
    'EAAIZBPaCRHwwBADOjene1cYe2b03BK78xfhCAnYhzbE70a1e8VCfBaryduNrXBeoIO86dVWR60zLvKfZCmFtx8Q0zKkZCl3Luy6DHKJ4JqxodMdlMdZAw7PBaalCpvxZCwcKTuNPpPM4QdNv70IItPkRXPb76gC3jUIWRMB0v8NVZAGrHRKnDc8ZC5kNEpVajLarMa6ZBdRt67gRc4WJIPCvCcs0kL0EL8wZD';
  constructor(private apiService: ApiService, private http: HttpClient) {}

  facebookLogin() {
    // login with facebook and return observable with fb access token on success
    return from(
      new Promise<fb.StatusResponse>((resolve) =>
        FB.login(resolve, {
          scope:
            'instagram_basic,instagram_manage_insights,instagram_content_publish,ads_management ,business_management,pages_show_list,pages_read_engagement,pages_read_user_content,',
        })
      )
    ).subscribe((res) => {
      console.log(res);
    });
    // .pipe(concatMap(({ authResponse }) => {
    //   console.log(authResponse);

    //   if (!authResponse) return EMPTY;
    //   return of(authResponse.accessToken);
    // }));
  }

  logout() {
    // revoke app permissions to logout completely because FB.logout() doesn't remove FB cookie
    FB.api('/me/permissions', 'delete', null, () => FB.logout());
    // this.stopAuthenticateTimer();
    // this.accountSubject.next(null);
    // this.router.navigate(['/login']);
  }

  // Long Term Access Token
  longTermAccessToken(accessToken) {
    this.http
      .get(`https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token
    &client_id=${environment.facebookAppId}&client_secret=${environment.facebookSecret}&fb_exchange_token=${accessToken}`);
  }

  // return list of pages associated with facebook User
  getPagesList(accessToken) {
    this.http.get(
      `https://graph.facebook.com/v11.0/me/accounts?access_token=${accessToken}`
    );
  }

  // Get Linked Instagram Account
  getLinkedInstagram(pageID, accessToken) {
    this.http.get(
      `https://graph.facebook.com/v11.0/${pageID}?fields=instagram_business_account&access_token=${accessToken}`
    );
  }

  getInstagramUser(
    username = 'influocial',
    accessToken = this.ACCESS_TOKEN
  ): Observable<any> {
    return this.http
      .get(`https://graph.facebook.com/v11.0/${this.USER_ID}?fields=business_discovery.username(${username})
    {username,followers_count,media_count,follows_count,profile_picture_url}&access_token=${accessToken}`);
  }

  getInstagramPosts(
    username = 'influocial',
    accessToken = this.ACCESS_TOKEN
  ): Observable<any> {
    return this.http
      .get(`https://graph.facebook.com/v11.0/${this.USER_ID}?fields=business_discovery.username(${username})
    {media{comments_count,like_count,media_type,media_url,permalink}}&access_token=${accessToken}`);
  }

  getInsights_28_days(accessToken = this.ACCESS_TOKEN): Observable<any> {
    return this.http.get(
      `https://graph.facebook.com/v11.0/${this.USER_ID}/insights?metric=impressions,reach&period=days_28&access_token=${accessToken}`
    );
  }

  getInsightsDay(accessToken = this.ACCESS_TOKEN): Observable<any> {
    return this.http.get(
      `https://graph.facebook.com/v11.0/${this.USER_ID}/insights?metric=profile_views&period=day&access_token=${accessToken}`
    );
  }

  getInsightsAudience(accessToken = this.ACCESS_TOKEN): Observable<any> {
    return this.http
      .get(`https://graph.facebook.com/v11.0/${this.USER_ID}/insights?metric=audience_country,audience_city
    ,audience_gender_age&period=lifetime&access_token=${accessToken}`);
  }

  postContainer(
    imageUrl = null,
    caption = '',
    accessToken = this.ACCESS_TOKEN
  ) {
    return this.http.post(
      `https://graph.facebook.com/${this.USER_ID}/media?image_url=${imageUrl}&caption=${caption}&access_token=${accessToken}`,
      ''
    );
  }
  txt: any = '123';

  postContainer2(
    imageUrl = null,
    caption = '',
    accessToken = this.ACCESS_TOKEN
  ): Observable<any> {
    return this.apiService.post(`/instagram/captureFromInstagram`, {
      token: this.ACCESS_TOKEN,
      imageUrl: imageUrl,
      caption: caption,
    });
  }
  publishPost(creationID = null, accessToken = this.ACCESS_TOKEN) {
    return this.http.post(
      `https://graph.facebook.com/${this.USER_ID}/media_publish?creation_id=${creationID}&access_token=${accessToken}`,
      ''
    );
  }

  getMedia(mediaID = null, accessToken = this.ACCESS_TOKEN) {
    return this.http.get(
      `https://graph.facebook.com/${mediaID}?fields=comments_count,like_count,media_type,media_url,permalink&access_token=${accessToken}`
    );
  }

  getMediaInsights(
    mediaID = null,
    mediaType = null,
    accessToken = this.ACCESS_TOKEN
  ) {
    if (mediaType === 'VIDEO') {
      return this.http.get(
        `https://graph.facebook.com/${mediaID}/insights?metric=impressions,reach,engagement,video_views&access_token=${accessToken}`
      );
    } else {
      return this.http.get(
        `https://graph.facebook.com/${mediaID}/insights?metric=impressions,reach,engagement&access_token=${accessToken}`
      );
    }
  }

  //login
  login(data, userID): Observable<any> {
    return this.apiService.post(`/instagram/login/${userID}`, {
      instagram: data,
    });
  }
  //update login

  loginStatus(loginStatus, userID): Observable<any> {
    return this.apiService.post(`/instagram/loginStatus/${userID}`, {
      instagram: loginStatus,
    });
  }

  getCurrentUserStatus(userID): Observable<any> {
    return this.apiService.get(`/instagram/currentInstagramUser/${userID}`);
  }

  getProfileInformation(userID): Observable<any> {
    return this.apiService.get(`/instagram/getProfileInfo/${userID}`);
  }
}
