import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class SchedulerService {
  constructor(private apiService: ApiService) {}

  schedulePost(scheduledPost): Observable<any> {
    return this.apiService.post(`/schedulepost/post`, {
      scheduledPost: scheduledPost,
    });
  }

  getAll(): Observable<any> {
    return this.apiService.post(`/schedulepost/get/all`);
  }
}
