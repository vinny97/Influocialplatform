import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(
    private socketService: SocketService,
    private apiService: ApiService
  ) {}

  getEvent(userId: string) {
    console.log('inside getEvent');
    return this.socketService.onEvent('notification' + userId);
  }
  TournamentInviteEvent(userId: string) {
    return this.socketService.onEvent('TournamentInvite' + userId);
  }
  FiveV5InviteEvent(userId: string) {
    return this.socketService.onEvent('5V5Invite' + userId);
  }
  getNotification() {
    return this.apiService.post(`/notification`);
  }
  markAll() {
    return this.apiService.post(`/notification/mark-all`);
  }
  markAsRead(notificationId: string) {
    return this.apiService.post(`/notification/mark-as-read/${notificationId}`);
  }
}
