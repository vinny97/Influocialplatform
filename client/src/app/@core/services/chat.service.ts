import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ApiService } from './api.service';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(
    private apiService: ApiService,
    private socketService: SocketService
  ) {}

  addFriend(data): Observable<any> {
    return this.apiService.post(`/friend`, { data });
  }
  getAllFriends(page = 1, limit = 10): Observable<any> {
    return this.apiService.post(`/friend/all/?page=${page}&limit=${limit}`);
  }

  sendMessage(friendID: any, msg: any) {
    return this.apiService.post(`/chat/create/${friendID}`, msg);
  }

  unreadCount() {
    return this.apiService.post('/chat/count/unread');
  }
  getHistoryAndUser(id: any, page = 1, limit = 10) {
    return this.apiService.post(`/chat/${id}/?page=${page}&limit=${limit}`);
  }

  // getHistoryAndUser(id: any, params: any) { return this.apiService.get(`/chat/${id}?${params}`); }
  getChatUsers() {
    return this.apiService.post(`/chat/users`);
  }

  getConversationEvent(currentUserId: string) {
    return this.socketService.onEvent('conversation' + currentUserId);
  }
  //it will mark isRead to 'true' for all the available records against the given friendID
  isRead(currentUser, sentTo) {
    return this.apiService.get(`/chat/read/${currentUser}?sentTo=${sentTo}`);
  }
}
