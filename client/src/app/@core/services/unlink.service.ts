import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UnlinkService {

  constructor(private apiService: ApiService,) { }

  delete(url): Observable<any> {
    return this.apiService.post(`/upload/delete`, { url });
  }

}
