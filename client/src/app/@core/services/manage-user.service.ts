import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ManageUserService {
  constructor(private apiService: ApiService) {}

  getUserInfo(id = null): Observable<any> {
    return this.apiService.get(`/manageUser/${id}`);
  }
  getAll(page = 1, limit = 6, role = null, nameSearch = ''): Observable<any> {
    return this.apiService.get(
      `/manageUser/all/?page=${page}&limit=${limit}&role=${role}&nameSearch=${nameSearch}`
    );
  }
}
