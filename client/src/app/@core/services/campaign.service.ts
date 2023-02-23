import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class CampaignService {
  constructor(private apiService: ApiService) {}

  getCampaign(campaignID): Observable<any> {
    return this.apiService.post(`/campaign/${campaignID}`);
  }

  getAll(
    page = 1,
    limit = 6,
    status = null,
    nameSearch = '',
    type = null,
    selectedCategory = null,
    isFavorite = null
  ): Observable<any> {
    return this.apiService.post(
      `/campaign/all/?page=${page}&limit=${limit}&status=${status}&nameSearch=${nameSearch}&type=${type}&category=${selectedCategory}&isFavorite=${isFavorite}`
    );
  }

  addProposal(campaignID, proposal: any): Observable<any> {
    return this.apiService.post(`/campaign/${campaignID}/proposal`, {
      proposal,
    });
  }

  updateCampaign(campaignID: any, campaign: any): Observable<any> {
    return this.apiService.post(`/campaign/update/${campaignID}`, { campaign });
  }
}
