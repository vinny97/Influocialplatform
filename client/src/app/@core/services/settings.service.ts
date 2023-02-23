import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  constructor(private apiService: ApiService) {}

  getSettings(): Observable<any> {
    return this.apiService.post(`/settings`);
  }
  updateSettings(settings: any): Observable<any> {
    return this.apiService.post(`/settings`, settings);
  }
}
