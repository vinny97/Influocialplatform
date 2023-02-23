import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { ChatService, UserService } from '../@core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatBoxScroller') ChatScroller: ElementRef;
  socket: Socket;
  friends_page = 1;
  friends_limit = 10;
  selectedFriend = null;

  smHide = false;
  selectedUser = null;
  page = 1;

  users = null;
  isLoading = false;
  message = '';
  chat = [];
  currentUser: any = null;
  msg: string;
  url: string | ArrayBuffer;
  hasMoreChat: boolean;
  isChatLoad: boolean = true;
  constructor(
    private chatService: ChatService,
    private userService: UserService,
    private route: ActivatedRoute
  ) {
    this.socket = io(environment.apiUrl).connect();
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe((event) => {
      // console.log(event);
    });
    this.scrollBotton();
    this.getFriends();
    this.userService.currentUser.subscribe((res) => {
      console.log(res);
      this.currentUser = res;
      if (this.currentUser) {
        this.subscribeToUpdateConversation();
      }
    });
  }
  ngAfterViewChecked() {
    this.scrollBotton();
  }

  subscribeToUpdateConversation() {
    this.chatService
      .getConversationEvent(this.currentUser._id)
      .subscribe((e: any) => {
        this.getHistoryAndUser();
        this.getFriends();
      });
  }
  getFriends() {
    this.chatService
      .getAllFriends(this.friends_page, this.friends_limit)
      .subscribe((res) => {
        // console.log(res);

        if (res.status === 200) {
          this.users = res.data.result;

          // console.log(this.users);
          this.selectedFriend = this.users.docs[0];
          // console.log(this.selectedFriend);
          this.selectedUser = this.getOtherUser(this.users.docs[0]);
          this.getHistoryAndUser();
        }
      });
  }
  onUserClick(user, index) {
    console.log(user, index);
    this.selectedFriend = user;
    this.selectedUser = this.getOtherUser(user);
    this.smHide = !this.smHide;
    this.getHistoryAndUser();
    // this.isRead();
  }
  onBackClick() {
    this.smHide = false;
  }

  sendMessage() {
    console.log(this.selectedFriend._id);
    console.log(this.selectedUser._id);
    // console.log('Inside send msg');
    if (this.message !== '') {
      this.chatService
        .sendMessage(this.selectedFriend._id, {
          message: this.message,
          sentTo: this.selectedUser._id,
        })
        .subscribe((res: any) => {
          // console.log(res);
          this.socket.emit('conversation', this.message);
          if (res.status === 200) {
            this.isChatLoad = true;
            this.page = 1;
            this.getHistoryAndUser();
            console.log(this.selectedFriend._id);

            this.message = '';
          }
        });
    }
  }

  getHistoryAndUser() {
    console.log('Inside getHistoryAndUser');
    if (this.selectedFriend) {
      this.chatService
        .getHistoryAndUser(this.selectedFriend._id, this.page)
        .subscribe((res: any) => {
          console.log(res);
          if (res.status == 200) {
            this.chatService
              .getConversationEvent(this.selectedFriend._id)
              .subscribe((response) =>
                console.log('Response from chat:', response)
              );
            this.chatService
              .getConversationEvent(this.selectedUser._id)
              .subscribe((response) =>
                console.log('Response from chat:', response)
              );
            // console.log(res.status);
            let chat = res.data.history.docs;
            this.hasMoreChat = res.data.history.hasNextPage;

            // console.log(this.isChatLoad);
            // console.log(chat);
            if (this.page == 1) {
              this.chat = chat.map((c: any) => {
                return { ...c, fromNow: moment(c.createdAt).fromNow() };
              });
              // console.log(this.chat);
              this.chat.reverse();
            } else {
              chat.reverse();
              this.chat = chat.concat(this.chat);
              // console.log(this.chat);
            }
          } else {
            this.chat = [];
          }
        });
    }
  }

  getOtherUser(u) {
    // console.log(u);
    if (u && this.currentUser) {
      return this.currentUser._id === u.user1._id ? u.user2 : u.user1;
    }
  }
  onUploadImage(event: any) {
    // console.log(event);
    this.url = event;
  }
  scrollBotton(): void {
    if (this.isChatLoad) {
      try {
        this.ChatScroller.nativeElement.scrollTop =
          this.ChatScroller.nativeElement.scrollHeight;
      } catch (err) {}
    }
  }
  loadChat() {
    this.page++;
    this.isChatLoad = false;
    this.getHistoryAndUser();
  }
  isRead() {
    this.chatService
      .isRead(this.currentUser._id, this.selectedUser._id)
      .subscribe((response) => {
        console.log(response);
      });
  }
}
