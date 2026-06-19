import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../shared/data.service';
import { Location } from '@angular/common';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { ChatService } from '../shared/chat.service';
import { Chat } from '../models/chat.model';


@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css',
})
export class MessagesComponent implements OnInit {
  isLoading: boolean = false;
  @ViewChild('chatBody') myDiv: ElementRef | undefined;
  user: any;
  users: User[] = [];
  displayUsers: User[] = [];
  unreadCounts: Record<string, number> = {};
  constructor(
    private data: DataService,
    private _location: Location,
    private router: Router,
    private chat: ChatService,
    ) {}
  async ngOnInit() {
    const userToken =
      sessionStorage.getItem('token') || localStorage.getItem('token');

    if (userToken) {
      this.isLoading = true;
      this.user = await this.data.getUser(userToken);
      this.chat.unreadCounts$.subscribe((counts) => {
        this.unreadCounts = counts;
      });

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
          this.loadRecentConversations();
        });

      this.chat.newMessageReceived.subscribe((msg: any) => {
        if (!this.isMessageForCurrentUser(msg)) {
          return;
        }

        const otherUserId = this.getOtherUserId(msg);
        const userIndex = this.users.findIndex(u => String(u.id) === String(otherUserId));
        if (userIndex !== -1) {
          this.users[userIndex].recentMessage = this.getMessagePreview(msg);
          this.users[userIndex].recentMessageTime = msg.createdAt;
          this.displayUsers = this.getSortedDisplayUsers();
        }
      });
    }
  }

  isMessagesLoading = true;
  loadRecentConversations() {
    this.isMessagesLoading = true;

    this.chat.getMessages().subscribe({
      next: (messages) => {
        const latestByUserId = new Map<string, Chat>();

        messages
          .filter((msg) => this.isMessageForCurrentUser(msg))
          .forEach((msg) => {
            const otherUserId = this.getOtherUserId(msg);
            const key = String(otherUserId);
            const currentLatest = latestByUserId.get(key);

            if (!currentLatest || this.getMessageTime(msg) > this.getMessageTime(currentLatest)) {
              latestByUserId.set(key, msg);
            }
          });

        this.users = this.users.map((user) => {
          const latest = latestByUserId.get(String(user.id));

          return {
            ...user,
            recentMessage: latest ? this.getMessagePreview(latest) : undefined,
            recentMessageTime: latest?.createdAt,
          };
        });

        this.displayUsers = this.getSortedDisplayUsers();
        this.isMessagesLoading = false;
        this.isLoading = false;
      },
      error: () => {
        this.displayUsers = [];
        this.isMessagesLoading = false;
        this.isLoading = false;
      },
    });
  }

  private isMessageForCurrentUser(msg: Chat): boolean {
    return (
      String(msg.senderId) === String(this.user?.id) ||
      String(msg.recieverId) === String(this.user?.id)
    );
  }

  private getOtherUserId(msg: Chat): string | number {
    return String(msg.senderId) === String(this.user.id) ? msg.recieverId : msg.senderId;
  }

  private getMessagePreview(msg: Chat): string {
    return msg.text?.trim() || (msg.attachment ? 'Attachment' : '');
  }

  private getMessageTime(msg: Chat): number {
    const parsed = new Date(msg.createdAt).getTime();
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  private getSortedDisplayUsers(): User[] {
    return this.users
      .filter((user) => user.recentMessageTime)
      .sort((a, b) => {
        const aTime = new Date(a.recentMessageTime || '').getTime() || 0;
        const bTime = new Date(b.recentMessageTime || '').getTime() || 0;
        return bTime - aTime;
      });
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

  getUnreadCount(userId: string | number): number {
    return this.unreadCounts[String(userId)] || 0;
  }

  navigateToChat(userId: string | number): void {
    this.chat.markConversationRead(userId);
    this.router.navigate(['/chat', userId]);
  }
}




