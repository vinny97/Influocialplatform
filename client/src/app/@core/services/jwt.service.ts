import { Injectable } from '@angular/core';


@Injectable()
export class JwtService {

  getToken(): String {
    return window.localStorage['callACabJwtToken'];
  }

  saveToken(token: String) {
    window.localStorage['callACabJwtToken'] = token;
  }

  destroyToken() {
    window.localStorage.removeItem('callACabJwtToken');
  }

}
