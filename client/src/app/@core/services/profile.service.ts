import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(
    private socketService: SocketService,
    private apiService: ApiService
  ) {}

  createPortfolio(portfolio): Observable<any> {
    return this.apiService.post(`/portfolio/`, { portfolio: portfolio });
  }
  getAllPortfolio(): Observable<any> {
    return this.apiService.post(`/portfolio/all`);
  }
  getAllPortfoliosById(influencerID): Observable<any> {
    return this.apiService.post(`/portfolio/all/${influencerID}`);
  }
}
