import { Component, OnInit } from '@angular/core';
import { Tweet } from '../models/tweet.model';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { DataService } from '../shared/data.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-bookmark',
  templateUrl: './bookmark.component.html',
  styleUrls: ['./bookmark.component.css'],
})
export class BookmarkComponent implements OnInit {
  tweets: Tweet[] = [];
  user!: any;
  isLoading: boolean = true;
  constructor(
    private router: Router,
    private _location: Location,
    private data: DataService,
    private ngxService: NgxUiLoaderService,
    private toastr: ToastrService
  ) {}
  async ngOnInit() {
    const userToken =
      sessionStorage.getItem('token') ?? localStorage.getItem('token');
    if (userToken) {
      this.user = await this.data.getUser(userToken);
    } else {
      this.router.navigate(['login']);
      return;
    }

    this.ngxService.start();

    this.getBookmarks();
  }
  getBookmarks(){
    this.tweets = [];
    this.data.getAllBookmarks(this.user.id).subscribe((res: any) => {
      res
        .map(
          (e: any) => {
            const data = e.payload.doc.data();
            data.id = e.payload.doc.id;
            return data;
          },
          () => {
            alert('Error while fetching tweets');
          }
        )
        .forEach(async (element: any) => {
          let tweet = await this.data.getTweet(element.tweetId);
          this.tweets.push(tweet);
        });

      this.ngxService.stop();
      setTimeout(() => {
        this.isLoading = false;
      }, 100);
    });
  }
  clearBookmarks() {
    if (window.confirm('Are you sure you want to clear all bookmarks?')) {
      this.tweets = [];
      this.data.clearBookmarks(this.user?.id).then(() => {
        this.toastr.success('Bookmarks cleared successfully');
        this.getBookmarks();
      })
    }
  }
  goBack() {
    this._location.back();
  }
}
