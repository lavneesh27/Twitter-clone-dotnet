import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Tweet } from '../models/tweet.model';
import { Bookmark } from '../models/bookmark.model';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MainService {
  baseUrl = `${environment.apiUrl}/`;
  userToken = sessionStorage.getItem('user') ?? localStorage.getItem('user');
  headers = new HttpHeaders({
    Authorization: `Bearer ${this.userToken}`,
  });
  gifs= new BehaviorSubject<any>([]);
  loginUserObject: User|undefined;
  constructor(private http: HttpClient) {}

  registerUser(user: User) {
    let url = this.baseUrl + 'User/RegisterUser';

    return this.http.post(url, user, { responseType: 'text' });
  }

  loginUser(email: string, password: string) {
    let url = this.baseUrl + 'User/LoginUser';
    return this.http.post(
      url,
      { Email: email, Password: password },
      { responseType: 'text' }
    );
  }

  loadTweets() {
    let url = this.baseUrl + 'Tweet/GetTweets';
    return this.http.get(url, { headers: this.headers });
  }

  likeTweet(id: number, isLiked: boolean) {
    let url = this.baseUrl + 'Tweet/LikeTweet/' + id + '/' + isLiked;
    return this.http.post(url, null, {
      responseType: 'text',
      headers: this.headers,
    });
  }

  getUser(id: number) {
    let url = this.baseUrl + 'User/GetUser/' + id;
    return this.http.get(url);
  }
  getTweet(id: number) {
    let url = this.baseUrl + 'Tweet/GetTweet/' + id;
    return this.http.get(url, { headers: this.headers });
  }
  getUsers() {
    let url = this.baseUrl + 'User/GetUsers';
    return this.http.get(url, { headers: this.headers });
  }

  upload(tweet: Tweet) {
    let url = this.baseUrl + 'Tweet/UploadTweet';
    return this.http.post(url, tweet, {
      responseType: 'text',
      headers: this.headers,
    });
  }

  addBookmark(bookmark: Bookmark) {
    let url = this.baseUrl + 'Bookmarks/AddBookmark';
    return this.http.post(url, bookmark, {
      responseType: 'text',
      headers: this.headers,
    });
  }

  getBookmarks(id: number) {
    let url = this.baseUrl + 'Bookmarks/GetBookmark/' + id;
    return this.http.get(url, { headers: this.headers })
  }

  updateUser(user: User, id: number) {
    let url = this.baseUrl + 'User/UpdateUser/' + id;
    return this.http.put(url, user, { responseType: 'text' });
  }

  getTrendingGifs() {
    return this.http.get(
      `https://api.giphy.com/v1/gifs/trending?api_key=${environment.gifApiKey}&limit=25&offset=0&rating=g&bundle=messaging_non_clips`
    ).subscribe((res:any)=>{
      this.gifs.next(res.data);
    });
  }

  searchGifs(searchTerm: string) {
    return this.http.get(
      `https://api.giphy.com/v1/gifs/search?api_key=${environment.gifApiKey}&q=${searchTerm}&limit=25&offset=0&rating=g&lang=en&bundle=messaging_non_clips`
    ).subscribe((res:any)=>{
      this.gifs.next(res.data);
    });
  }
  getGifs(){
    return this.gifs.asObservable();
  }
  getGifByteArray(gifUrl: string): Observable<Uint8Array> {
    return this.http.get(gifUrl, { responseType: 'arraybuffer' })
      .pipe(
        map((gifData: ArrayBuffer) => {
          return new Uint8Array(gifData);
        })
      );
  }
}



