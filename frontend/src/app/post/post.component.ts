import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../shared/data.service';
import { Tweet } from '../models/tweet.model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-post',
  standalone: false,
  templateUrl: './post.component.html',
  styleUrl: './post.component.css',
})
export class PostComponent implements OnInit {
  postId: string | undefined;
  tweet: Tweet | undefined;
  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private _location: Location,
  ) {}
  ngOnInit(): void {
    this.route.params.subscribe(async (params) => {
      this.postId = params['id'];
      if (this.postId) {
        this.tweet = await this.dataService.getTweet(this.postId);
      }
    });
  }
  goBack() {
    this._location.back();
  }
  removePost(){
    this.tweet = undefined;
    this.postId = undefined;
  }
}



