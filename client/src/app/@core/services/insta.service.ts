import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, from } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FacebookService, LoginOptions } from 'ngx-facebook';

@Injectable({
  providedIn: 'root',
})
export class InstaService {
  //facebook app id
  appId = environment.facebookAppId;
  facebookSecret = environment.facebookSecret;
  appURL = environment.apiUrl;
  //facebook loginoptions defining scope of the token
  loginOptions: LoginOptions = {
    enable_profile_selector: true,
    return_scopes: true,
    scope:
      'public_profile,instagram_manage_insights,instagram_content_publish,instagram_basic,email,pages_show_list,pages_read_engagement',
  };

  USER_ID = 17841441871512114;

  ACCESS_TOKEN =
    'EAAIZBPaCRHwwBADOjene1cYe2b03BK78xfhCAnYhzbE70a1e8VCfBaryduNrXBeoIO86dVWR60zLvKfZCmFtx8Q0zKkZCl3Luy6DHKJ4JqxodMdlMdZAw7PBaalCpvxZCwcKTuNPpPM4QdNv70IItPkRXPb76gC3jUIWRMB0v8NVZAGrHRKnDc8ZC5kNEpVajLarMa6ZBdRt67gRc4WJIPCvCcs0kL0EL8wZD';
  constructor(
    private apiService: ApiService,
    private http: HttpClient,
    private facebook: FacebookService
  ) {
    facebook.init({
      appId: this.appId,
      version: 'v2.9',
    });
  }

  //login with facebook
  loginWithFacebook() {
    return this.facebook.login(this.loginOptions);
  }

  //to get long term access token for 60 days
  getLongTermAccessToken(accessToken): Observable<any> {
    return this.http.get(
      `https://graph.facebook.com/v12.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${this.appId}&client_secret=${this.facebookSecret}&fb_exchange_token=${accessToken}`
    );
  }
  //get user's pages
  getUsersProfile(accessToken): Observable<any> {
    return this.http.get(
      `https://graph.facebook.com/v12.0/me/accounts?access_token=${accessToken}`
    );
  }
  //getInstagramBusinessPages {pages linked with profile}
  getUsersBusinessPages(userID, accessToken): Observable<any> {
    return this.http.get(
      `https://graph.facebook.com/v12.0/${userID}?fields=instagram_business_account&access_token=${accessToken}`
    );
  }
  //getBusinessPageInfo //username, name etc
  getBusinessPageInfo(pageID, accessToken): Observable<any> {
    return this.http.get(
      `https://graph.facebook.com/v3.2/${pageID}?fields=biography,id,username,follows_count,followers_count,media_count,profile_picture_url,website&access_token=${accessToken}`
    );
  }
  //insights for 28 days
  getinsights_28Days(pageID, accessToken): Observable<any> {
    return this.http.get(
      `https://graph.facebook.com/${pageID}/insights?metric=impressions,reach&period=days_28&access_token=${accessToken}`
    );
  }
  //insights for 1 day
  getiDailyInsights(pageID, accessToken): Observable<any> {
    return this.http.get(
      `https://graph.facebook.com/${pageID}/insights?metric=profile_views&period=day&access_token=${accessToken}`
    );
  }
  //get media ids
  getMediaIDs(pageID, accessToken): Observable<any> {
    return this.http.get(
      `https://graph.facebook.com/v12.0/${pageID}/media?access_token=${accessToken}`
    );
  }
  //get Media object
  getMediaObject(mediaID, accessToken): Observable<any> {
    return this.http.get(
      `https://graph.facebook.com/v12.0/${mediaID}?fields=id,media_url,caption,comments_count,like_count,media_type,media_product_type,permalink,thumbnail_url&access_token=${accessToken}`
    );
  }
  //get audience
  getInsightsAudience(pageID, accessToken): Observable<any> {
    return this.http
      .get(`https://graph.facebook.com/v11.0/${pageID}/insights?metric=audience_country,audience_city
    ,audience_gender_age&period=lifetime&access_token=${accessToken}`);
  }
  //post a picture
  postContainer(pageID, imageUrl = null, caption = '', accessToken) {
    return this.http.post(
      `https://graph.facebook.com/${pageID}/media?image_url=${imageUrl}&caption=${caption}&access_token=${accessToken}`,
      ''
    );
  }
  //post a picture
  postContainer2(imageUrl, caption, accessToken): Observable<any> {
    return this.apiService.post(`/instagram/captureFromInstagram`, {
      token: accessToken,
      imageUrl: imageUrl,
      caption: caption,
    });
  }
  //publish post
  publishPost(pageID, containerID = null, accessToken) {
    return this.http.post(
      `https://graph.facebook.com/${pageID}/media_publish?creation_id=${containerID}&access_token=${accessToken}`,
      ''
    );
  }
  facebookLogin() {
    // login with facebook and return observable with fb access token on success
    return from(
      new Promise<fb.StatusResponse>((resolve) =>
        FB.login(resolve, {
          scope:
            'instagram_basic,instagram_manage_insights,instagram_content_publish,ads_management ,business_management,pages_show_list,pages_read_engagement,',
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

  //get pages collections

  getPagesCollection(userID, accesstoken): Observable<any> {
    return this.http.get(
      `https://graph.facebook.com/v12.0/${userID}/accounts?access_token=${accesstoken}`
    );
  }
  //get Media
  getPageMedia(userID, accesstoken): Observable<any> {
    return this.http.get(
      `https://graph.facebook.com/v12.0/${userID}/accounts?access_token=${accesstoken}`
    );
  }

  //5. Get the Page's Instagram Business Account
  getBusinessPage(userID, accesstoken): Observable<any> {
    return this.http.get(
      `https://graph.facebook.com/v12.0/${userID}?fields=instagram_business_account&access_token=${accesstoken}`
    );
  }
  //6. Get the Instagram Business Account's Media Objects
  getBusinessPageMediaObjects(userID, accesstoken): Observable<any> {
    return this.http.get(
      `https://graph.facebook.com/v12.0/${userID}/media?access_token=${accesstoken}`
    );
  }
  //7 get insights from
  getInsights_28_days1(userID, accesstoken): Observable<any> {
    return this.http.get(
      `https://graph.facebook.com/v11.0/${userID}/insights?metric=impressions,reach&period=days_28&access_token=${accesstoken}`
    );
  }
  // Long Term Access Token
  longTermAccessToken(
    accessToken,
    facebookAppId,
    facebookSecret
  ): Observable<any> {
    return this.http
      .get(`https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token
    &client_id=${facebookAppId}&client_secret=${facebookSecret}&fb_exchange_token=${this.ACCESS_TOKEN}&redirect_uri=https://www.youtube.com/`);
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
  //get posts
  getInstagramPosts1(
    username = 'influocial',
    accessToken = this.ACCESS_TOKEN
  ): Observable<any> {
    return this.http
      .get(`https://graph.facebook.com/v11.0/${this.USER_ID}?fields=business_discovery.username(${username})
    {media{comments_count,like_count,media_type,media_url,permalink}}&access_token=${accessToken}`);
  }
  ///get basic dettails
  getInstagramUserDetails(userId, accessToken): Observable<any> {
    return this.http.get(
      `https://graph.instagram.com/${userId}?fields=id,username&access_token=${accessToken}`
    );
  }
  getInstagramUser(username, userID, accessToken): Observable<any> {
    return this.http
      .get(`https://graph.facebook.com/v11.0/${userID}?fields=business_discovery.username(${username})
    {username,followers_count,media_count,follows_count,profile_picture_url}&access_token=${accessToken}`);
  }

  getInstagramPosts(
    username = 'influocial',
    userID,
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

  txt: any = '123';

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
