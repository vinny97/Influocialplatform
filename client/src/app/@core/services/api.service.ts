import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { JwtService } from './jwt.service';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ApiService {
  constructor(
    private http: HttpClient,
    private jwtService: JwtService
  ) { }

  private formatErrors(error: any) {
    return throwError(error.error);
  }

  get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api${path}`, { params })
      .pipe(catchError(this.formatErrors));
  }

  put(path: string, body: Object = {}): Observable<any> {
    let token = this.jwtService.getToken();
    console.log("Token", token);
    const headers = { "Content-type": "application/json", "Authorization": `Token ${token}` }
    return this.http.put(
      `${environment.apiUrl}/api${path}`,
      JSON.stringify(body),
      { headers }
    ).pipe(catchError(this.formatErrors));
  }

  post(path: string, body: Object = {}): Observable<any> {
    let token = this.jwtService.getToken();
    console.log("Token", token);
    const headers = { "Content-type": "application/json", "Authorization": `Token ${token}` }
    return this.http.post(
      `${environment.apiUrl}/api${path}`,
      JSON.stringify(body),
      { headers }
    ).pipe(catchError(this.formatErrors));
  }

  

  delete(path): Observable<any> {
    let token = this.jwtService.getToken();
    console.log("Token", token);
    const headers = { "Content-type": "application/json", "Authorization": `Token ${token}` }
    return this.http.delete(
      `${environment.apiUrl}/api${path}`,
      { headers }
    ).pipe(catchError(this.formatErrors));
  }
}
