import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ProposalService {
  constructor(private apiService: ApiService,) { }

  getProposal(proposalID): Observable<any> { return this.apiService.post(`/proposal/${proposalID}`) };

  getAll(page = 1, limit = 6, campaignID = null, status = null, isFavorite = null, outrightStatus = null, contentStatus = null): Observable<any> {
    return this.apiService.post(`/proposal/all/?page=${page}&limit=${limit}&campaign=${campaignID}&status=${status}&isFavorite=${isFavorite}
    &outrightStatus=${outrightStatus}&contentStatus=${contentStatus}`);
  };

  allInfluencerProposals(page = 1, limit = 6, status = null, outrightStatus = null, campaignType = null): Observable<any> {
    return this.apiService.post(`/proposal/influencer/all/?page=${page}&limit=${limit}&campaignType=${campaignType}&status=${status}&outrightStatus=${outrightStatus}`);
  };

  updateProposal(proposalID: any, proposal: any): Observable<any> { return this.apiService.put(`/proposal/${proposalID}`, { proposal }) };

}
