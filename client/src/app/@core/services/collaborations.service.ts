import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class CollaborationsService {
  constructor(private apiService: ApiService) {}

  getCollaborations(brand): Observable<any> {
    console.log(brand);
    return this.apiService.post(`/collaborations/${brand}`);
  }
  rate(body: any): Observable<any> {
    return this.apiService.post(`/collaborations`, { collaboration: body });
  }
  getRating(influencerID) {
    return this.apiService.post(`/collaborations/rating/${influencerID}`);
  }
  getInfluencers() {
    return this.apiService.post(`/scraper/scrapeFolderNames`);
  }
  getImg(link: any) {
    return this.apiService.post(`/scraper/getImg`, { url: link });
  }
}
