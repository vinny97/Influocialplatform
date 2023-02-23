import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ApiService } from './api.service';


@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(private apiService: ApiService,) { }

  getGroup(groupID): Observable<any> { return this.apiService.post(`/group/${groupID}`) };

  updateGroup(groupID: any, group: any = null): Observable<any> { return this.apiService.post(`/group/${groupID}`, { group }) };

  createGroup(group: any): Observable<any> { return this.apiService.post(`/group/`, { group }) };

  getAll(page = 1, limit = 6): Observable<any> { return this.apiService.post(`/group/all/?page=${page}&limit=${limit}`) };

  getList(userID: any): Observable<any> { return this.apiService.post(`/group/list/?userID=${userID}`) };

  getCollaborators(page = 1, limit = 6): Observable<any> { return this.apiService.post(`/group/collaborators/?page=${page}&limit=${limit}`) };

  deleteGroup(groupID): Observable<any> { return this.apiService.post(`/group/${groupID}`) };

}
