import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chat } from '../models/chat.model';
import { BehaviorSubject, firstValueFrom, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private readonly baseUrl = environment.apiUrl;
  private hubConnection: signalR.HubConnection | undefined;
  private activeConversationId: string | null = null;
  private unreadCountsSubject = new BehaviorSubject<Record<string, number>>({});
  public unreadCounts$ = this.unreadCountsSubject.asObservable();
  public unreadTotal$ = new BehaviorSubject<number>(0);
  public newMessageReceived = new Subject<Chat>();

  constructor(private http: HttpClient) {
    this.loadUnreadCounts();
    this.startConnection();
  }

  private startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.baseUrl.replace('/api', '/chatHub'))
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('SignalR connection started'))
      .catch((err) => console.log('Error while starting SignalR connection: ' + err));

    this.hubConnection.on('ReceiveMessage', (data: Chat) => {
      this.trackIncomingUnread(data);
      this.newMessageReceived.next(data);
    });
  }
  chat: Chat = {
    id: 0,
    senderId: 0,
    recieverId: 0,
    text: '',
    createdAt: '',
    attachment: '',
  };
  sendMessage(chat: Chat, reciever: string | number) {
    this.chat.text = chat.text;
    this.chat.id = 0;
    this.chat.senderId = Number(
      sessionStorage.getItem('token') ?? localStorage.getItem('token')!
    );
    this.chat.recieverId = Number(reciever);
    this.chat.createdAt = new Date().toString();
    this.chat.attachment = chat.attachment;
    return firstValueFrom(this.http.post<Chat>(`${this.baseUrl}/chat`, this.chat));
  }
  getMessages() {
    return this.http.get<Chat[]>(`${this.baseUrl}/chat`);
  }
  getDisplayMessage(receiverId: string | number, senderId: string | number): Observable<unknown[]> {
    return this.http.get<Chat[]>(`${this.baseUrl}/chat/recent`, {
      params: { receiverId, senderId },
    });
  }

  clearMessages(chatArray: any) {
    chatArray.forEach((element: any) => {
      firstValueFrom(this.http.delete<void>(`${this.baseUrl}/chat/${element.id}`))
        .then(() => console.log('cleared'))
        .catch((error) => console.error('Error deleting message: ', error));
    });
  }

  setActiveConversation(userId: string | number | null) {
    this.activeConversationId = userId == null ? null : String(userId);

    if (userId != null) {
      this.markConversationRead(userId);
    }
  }

  markConversationRead(userId: string | number) {
    const counts = { ...this.unreadCountsSubject.value };
    delete counts[String(userId)];
    this.saveUnreadCounts(counts);
  }

  getUnreadCount(userId: string | number): number {
    return this.unreadCountsSubject.value[String(userId)] || 0;
  }

  refreshUnreadCounts() {
    this.loadUnreadCounts();
  }

  private trackIncomingUnread(message: Chat) {
    const currentUserId = this.getCurrentUserId();

    if (!currentUserId || String(message.recieverId) !== currentUserId) {
      return;
    }

    const senderId = String(message.senderId);

    if (this.activeConversationId === senderId) {
      this.markConversationRead(senderId);
      return;
    }

    const counts = { ...this.unreadCountsSubject.value };
    counts[senderId] = (counts[senderId] || 0) + 1;
    this.saveUnreadCounts(counts);
  }

  private loadUnreadCounts() {
    const rawCounts = localStorage.getItem(this.getUnreadStorageKey());
    let counts: Record<string, number> = {};

    if (rawCounts) {
      try {
        counts = JSON.parse(rawCounts);
      } catch {
        counts = {};
      }
    }

    this.unreadCountsSubject.next(counts);
    this.unreadTotal$.next(this.getUnreadTotal(counts));
  }

  private saveUnreadCounts(counts: Record<string, number>) {
    localStorage.setItem(this.getUnreadStorageKey(), JSON.stringify(counts));
    this.unreadCountsSubject.next(counts);
    this.unreadTotal$.next(this.getUnreadTotal(counts));
  }

  private getUnreadStorageKey(): string {
    return `chatUnread:${this.getCurrentUserId() || 'anonymous'}`;
  }

  private getCurrentUserId(): string | null {
    return sessionStorage.getItem('token') ?? localStorage.getItem('token');
  }

  private getUnreadTotal(counts: Record<string, number>): number {
    return Object.values(counts).reduce((total, count) => total + count, 0);
  }
}



