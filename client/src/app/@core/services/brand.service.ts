import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  constructor(
    private apiService: ApiService,
  ) { }

  post(brand: any): Observable<any> { return this.apiService.post('/brand', { brand }); }
  put(brandId, brand: any): Observable<any> { return this.apiService.put(`/brand/${brandId}`, { brand }); }
  delete(brandId): Observable<any> { return this.apiService.post(`/brand/${brandId}`); }
  get(filter): Observable<any> { return this.apiService.post('/brand/get', { filter }); }
  getById(brandId): Observable<any> { return this.apiService.post(`/brand/${brandId}`); }
  getCampaignsByBrandId(brandId, page = 1, limit = 6, status = null, nameSearch = "", type = null): Observable<any> { return this.apiService.post(`/brand/${brandId}/get/campaign/?page=${page}&limit=${limit}&status=${status}&nameSearch=${nameSearch}&type=${type}`); }
  postCampaignsByBrandId(brandId, campaign): Observable<any> { return this.apiService.post(`/brand/${brandId}/campaign`, { campaign }); }

}
