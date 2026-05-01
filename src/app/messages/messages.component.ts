import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../shared/data.service';
import { Location } from '@angular/common';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { ChatService } from '../shared/chat.service';
import { forkJoin, map, Observable } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css',
})
export class MessagesComponent implements OnInit {
  @ViewChild('chatBody') myDiv: ElementRef | undefined;
  user: any;
  users: User[] = [];
  displayUsers: User[] = [];

  constructor(
    private data: DataService,
    private _location: Location,
    private router: Router,
    private chat: ChatService,
    private ngxService: NgxUiLoaderService
  ) {}
  async ngOnInit() {
    const userToken =
      sessionStorage.getItem('token') || localStorage.getItem('token');

    if (userToken) {
      this.ngxService.start();
      this.user = await this.data.getUser(userToken);
      this.data.getAllUsers().subscribe((res: any) => {
        this.users = res
          .map(
            (e: any) => {
              const data = e.payload.doc.data();
              data.id = e.payload.doc.id;
              return data;
            },
            () => {
              alert('Error while fetching users');
            }
          )
          .filter((people: User) => people.userName !== this.user.userName);
          this.getRecentForAllUsers();
        });

      this.chat.newMessageReceived.subscribe((msg: any) => {
        const otherUserId = msg.senderId === this.user.id ? msg.recieverId : msg.senderId;
        const userIndex = this.users.findIndex(u => u.id === otherUserId);
        if (userIndex !== -1) {
          this.users[userIndex].recentMessage = msg.text;
          this.users[userIndex].recentMessageTime = msg.createdAt;
          this.displayUsers = this.users.filter(u => u.recentMessage).sort((a, b) => {
            if (a.recentMessageTime && b.recentMessageTime) {
              return new Date(b.recentMessageTime).getTime() - new Date(a.recentMessageTime).getTime();
            } else if (a.recentMessageTime) {
              return -1;
            } else if (b.recentMessageTime) {
              return 1;
            }
            return 0;
          });
        }
      });
    }
  }

  isMessagesLoading = true;
  getRecentForAllUsers() {
    this.isMessagesLoading = true;
    for (let i = 0; i < this.users.length; i++) {
      this.getRecentMessage(this.users[i].id).subscribe((msg: any) => {
        this.users[i].recentMessage = msg?.text;
        this.users[i].recentMessageTime = msg?.createdAt;
        if (i == this.users.length - 1) {
          this.displayUsers = this.users.filter(user => user.recentMessage).sort((a, b) => {
            if (a.recentMessageTime && b.recentMessageTime) {
              return new Date(b.recentMessageTime).getTime() - new Date(a.recentMessageTime).getTime();
            } else if (a.recentMessageTime) {
              return -1;
            } else if (b.recentMessageTime) {
              return 1;
            }
            return 0;
          });
          this.isMessagesLoading = false;
          this.ngxService.stop();
        }
      });
    }
  }
  getRecentMessage(senderId: any): Observable<string> {
    return this.chat.getDisplayMessage(senderId, this.user.id).pipe(
      map((res: any) => {
        let result;
        if (res[0]?.createdAt && res[1]?.createdAt) {
          result = (res[0].createdAt > res[1].createdAt) ? res[0] : res[1];
        } else {
          result = res[0] ? res[0] : res[1];
        }
        return result ? result : null;
      })
    );
}
  filter(searchText: string) {
    this.data.getAllUsers().subscribe((res: any) => {
      this.users = res
        .map(
          (e: any) => {
            const data = e.payload.doc.data();
            data.id = e.payload.doc.id;

            return data;
          },
          () => {
            alert('Error while fetching users');
          }
        )
        .filter((user: User) => {
          return (
            (user.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
              user.userName.toLowerCase().includes(searchText.toLowerCase())) &&
            user.userName !== this.user.userName
          );
        });
    });
  }
  goBack() {
    this._location.back();
  }
  navigateToChat(userId: string | number): void {
    this.router.navigate(['/chat', userId]);
  }
}
