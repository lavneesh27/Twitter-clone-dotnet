import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chat } from '../models/chat.model';
import { firstValueFrom, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}
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
}
