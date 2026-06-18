import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom, map } from 'rxjs';
import { Tweet } from '../models/tweet.model';
import { User } from '../models/user.model';
import { Bookmark } from '../models/bookmark.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private snapshotList<T extends { id: string | number }>(source: Observable<T[]>) {
    return source.pipe(
      map((items) =>
        items.map((item) => ({
          payload: {
            doc: {
              id: item.id,
              data: () => ({ ...item }),
            },
          },
        }))
      )
    );
  }

  //tweet
  addTweet(tweet: Tweet) {
    tweet.createdAt = new Date().toDateString();
    return firstValueFrom(this.http.post<Tweet>(`${this.baseUrl}/tweets`, tweet));
  }
  removeTweet(tweetId: string | number) {
    return firstValueFrom(this.http.delete<void>(`${this.baseUrl}/tweets/${tweetId}`));
  }
  getAllTweets() {
    return this.snapshotList(this.http.get<Tweet[]>(`${this.baseUrl}/tweets`));
  }
  likeTweet(tweet: Tweet, userId: string | number) {
    return firstValueFrom(this.http.post<void>(`${this.baseUrl}/tweets/${tweet.id}/likes/${userId}`, null));
  }
  unlikeTweet(tweet: Tweet, userId: string | number) {
    return firstValueFrom(this.http.delete<void>(`${this.baseUrl}/tweets/${tweet.id}/likes/${userId}`));
  }

  async getTweet(id: string | number): Promise<any> {
    try {
      return await firstValueFrom(this.http.get<Tweet>(`${this.baseUrl}/tweets/${id}`));
    } catch (error) {
      console.error('There was an error getting your document:', error);
      return null;
    }
  }

  //user
  addUser(user: User) {
    return firstValueFrom(this.http.post<User>(`${this.baseUrl}/users`, user));
  }
  getAllUsers() {
    return this.snapshotList(this.http.get<User[]>(`${this.baseUrl}/users`));
  }



  async getUser(id: string | number): Promise<any> {
    try {
      return await firstValueFrom(this.http.get<User>(`${this.baseUrl}/users/${id}`));
    } catch (error) {
      console.error('There was an error getting your document:', error);
      return null;
    }
  }
  updateUser(user: User) {
    return firstValueFrom(this.http.put<void>(`${this.baseUrl}/users/${user.id}`, user));
  }

  //user1 if following user2
  follow(user1: string | number, user2: string | number) {
    return firstValueFrom(this.http.post<void>(`${this.baseUrl}/users/${user1}/follow/${user2}`, null));
  }

  unFollow(user1: string | number, user2: string | number) {
    return firstValueFrom(this.http.delete<void>(`${this.baseUrl}/users/${user1}/follow/${user2}`));
  }

  //bookmarks

  addBookmark(bookmark: Bookmark) {
    return firstValueFrom(this.http.post<Bookmark>(`${this.baseUrl}/bookmarks`, bookmark));
  }
  getAllBookmarks(id: string | number) {
    return this.snapshotList(this.http.get<Bookmark[]>(`${this.baseUrl}/bookmarks/user/${id}`));
  }

  clearBookmarks(userId: string | number) {
    return firstValueFrom(this.http.delete<void>(`${this.baseUrl}/bookmarks/user/${userId}`));
  }
  isBookmark(tweetId: string | number, userId: string | number): Promise<boolean> {
    return firstValueFrom(this.http.get<boolean>(`${this.baseUrl}/bookmarks/exists`, {
      params: { tweetId, userId },
    })).catch((error) => {
      console.error("Error checking bookmark:", error);
      return false;
    });
  }
  removeBookmark(tweetId: string | number, userId: string | number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${this.baseUrl}/bookmarks`, {
      params: { tweetId, userId },
    }));
  }
}
