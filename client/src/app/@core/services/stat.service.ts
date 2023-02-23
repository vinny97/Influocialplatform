import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class StatService {

  constructor(private apiService: ApiService,) { }

  adminStats(): Observable<any> { return this.apiService.post(`/stat/admin`) };

  influencerStats(): Observable<any> { return this.apiService.post(`/stat/influencer`) };

}
