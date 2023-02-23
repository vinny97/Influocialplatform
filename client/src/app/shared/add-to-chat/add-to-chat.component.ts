import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/@core';

@Component({
  selector: 'app-add-to-chat',
  templateUrl: './add-to-chat.component.html',
  styleUrls: ['./add-to-chat.component.css']
})
export class AddToChatComponent implements OnInit {

  @Input() userID: any;
  constructor(private chatService: ChatService, private router: Router) { }

  ngOnInit() {
  }

  onSubmit() {
    this.chatService.addFriend(this.userID).subscribe(res => {
      if (res.status === 200) {
        this.router.navigate(['/chat']);
      } else { }
    })
  }

}
