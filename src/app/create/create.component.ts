import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Tweet } from '../models/tweet.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Location} from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../shared/data.service';
import { UploadService } from '../shared/upload.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit {
  dataURL: string = '';
  tweet: Tweet = {
    id: 0,
    content: '',
    likes: [],
    userId: 0,
    createdAt: '',
    image: []
  };
  uploadForm!: FormGroup;
  user!: any;

  constructor(
    private route: Router,
    private fb: FormBuilder,
    private _location: Location,
    private toastr: ToastrService,
    private data:DataService,
    private uploadService: UploadService
  ) {}
  ngOnInit(): void {
    if(!(sessionStorage.getItem('token') || localStorage.getItem('token'))){
      this.route.navigate(['login']);
      return;
    }

    this.uploadForm = this.fb.group({
      content: ['', [Validators.required]],
      image: [''],
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    if (!file.type.startsWith('image/')) {
      alert('Please select only image files.');
      return;
    }
  
    this.uploadService.uploadImage(file)
      .then(downloadURL => {
        this.tweet.image = downloadURL;
        this.dataURL=downloadURL
      })
      .catch(error => {
        console.error('Error uploading image:', error);
      });

  }

  upload() {
    this.tweet.content = this.uploadForm.get('content')?.value.toString();
    this.tweet.userId = Number(sessionStorage.getItem('token') || localStorage.getItem('token'));
    this.data.addTweet(this.tweet).then(()=>{
      this.route.navigate(["home"]);
      this.toastr.success('uploaded');
    })
  }
  goBack(){
    this._location.back();
  }
}
