import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Tweet } from '../models/tweet.model';
import { Bookmark } from '../models/bookmark.model';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../shared/data.service';
import { Router } from '@angular/router';
import { User } from '../models/user.model';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent implements OnInit {
  @Input() tweet!: Tweet;
  @Output() bookmarkTrigger : EventEmitter<any> = new EventEmitter();
  @Output() deleteTrigger : EventEmitter<void> = new EventEmitter();
  user?: any;
  loginUser?: any;
  dataURL?: string;
  imgSrc: string = '';
  userURL?: string;
  like: boolean = false;
  bookmarkStatus: boolean | null = null;
  showImage: boolean = false;

  constructor(
    private toastr: ToastrService,
    private afs: DataService,
    private data: DataService,
    private router: Router
  ) {}
  async ngOnInit() {
    const userToken =
      sessionStorage.getItem('token') ?? localStorage.getItem('token');
    if (userToken) {
      this.loginUser = await this.data.getUser(userToken);
    }
    this.user = await this.data.getUser(this.tweet.userId);
    if (this.tweet.image?.length) {
      this.dataURL = this.tweet.image;
    }
    this.like = this.isLiked();
    this.checkBookmarkStatus();
  }
  checkBookmarkStatus(){
    this.afs.isBookmark(this.tweet?.id, this.loginUser?.id).then((result) => {
      this.bookmarkStatus = result;
    });
  }
  isLiked(): boolean {
    const likes = this.tweet.likes;
    const loginUser = this.loginUser;

    return (
      !!likes && !!likes.length && !!loginUser && likes.includes(loginUser.id.toString())
    );
  }

  likesCount(): number {
    const likes = this.tweet.likes;
    return likes ? likes.length : 0;
  }

  plusLike() {
    if (this.isLiked()) {
      this.afs.unlikeTweet(this.tweet, this.loginUser?.id).then(() => {
        this.tweet.likes = this.tweet.likes?.filter((id: string) => id !== this.loginUser?.id?.toString()) ?? [];
      });
    } else {
      this.afs.likeTweet(this.tweet, this.loginUser?.id).then(() => {
        this.tweet.likes = [...(this.tweet.likes ?? []), this.loginUser?.id?.toString()];
      });
    }
  }
  copy() {
    navigator.clipboard
      .writeText('http://localhost:4200/post/' + this.tweet.id)
      .then(() => {
        this.toastr.success('Copied to Clipboard');
      });
  }
  bookmark() {
    let bookmark: Bookmark = {
      id: 0,
      userId: this.loginUser.id,
      tweetId: this.tweet.id,
    };
    this.data.addBookmark(bookmark).then(() => {
      this.toastr.success('Bookmark Added');
      this.checkBookmarkStatus();
    });
  }

  onClick(event: any) {
    let target = event.target || event.srcElement || event.currentTarget;
    let srcAttr = target.attributes.src;
    this.imgSrc = srcAttr.nodeValue;
  }

  navigateToProfile(userId: string | number): void {
    this.router.navigate(['/profile', userId]);
  }
  redirect(id: string | number) {
    this.router.navigate(['post', id]);
  }
  delete(postId: string | number) {
    if (window.confirm("Are you sure you want to delete this post?")) {
      this.afs.removeTweet(postId).then((res) => {
        this.toastr.success('Tweet successfully deleted');
        this.deleteTrigger.emit();
      })
    }
  }
  unFollow(userId: string | number) {
    this.afs.unFollow(this.loginUser?.id, userId).then(res=>{
      this.toastr.success('Unfollowed Successfully');
    })
  }
  unBookmark(){
    this.data.removeBookmark(this.tweet?.id, this.loginUser?.id).then(() => {
      this.toastr.success('Bookmark Removed');
      this.checkBookmarkStatus();
      this.bookmarkTrigger.emit(true);
    });
  }
}
