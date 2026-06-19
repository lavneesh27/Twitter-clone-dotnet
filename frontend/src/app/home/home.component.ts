import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Tweet } from '../models/tweet.model';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../shared/data.service';
import { MainService } from '../shared/main.service';
import { ChatService } from '../shared/chat.service';
import { UploadService } from '../shared/upload.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  tweets: Tweet[] = [];
  dataURL: string = '';
  isLoading: boolean = true;
  tweet: Tweet = {
    id: 0,
    content: '',
    likes: [],
    userId: 0,
    createdAt: '',
    image: '',
  };
  uploadForm: any = {
    content: '',
    image: '',
  };
  user: any;
  gifs: any[] = [];
  subscription: any;
  showButton: boolean = false;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private dataService: DataService,
    private service: MainService,
    private chat: ChatService,
    private uploadService: UploadService
  ) {}
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    const appShell = document.querySelector('.app-shell');
    if (appShell && this.scrollListener) {
      appShell.removeEventListener('scroll', this.scrollListener);
    }
  }
  scrollListener: any;

  async ngOnInit() {
    this.scrollListener = this.onWindowScroll.bind(this);
    const appShell = document.querySelector('.app-shell');
    if (appShell) {
      appShell.addEventListener('scroll', this.scrollListener);
    }
    this.isLoading = true;
    if (!sessionStorage.getItem('token') && !localStorage.getItem('token')) {
      this.router.navigate(['login']);
      return;
    }
    let userToken =
      sessionStorage.getItem('token') ?? localStorage.getItem('token');
    this.user = await this.dataService.getUser(userToken!);

    this.isLoading = true;
    this.loadTweets();
    this.isLoading = false;
    setTimeout(() => {
      this.isLoading = false;
    }, 500);

  }
  loadTweets(){
    this.dataService.getAllTweets().subscribe((res: any) => {
      this.isLoading = false;
      this.tweets = res.map(
        (e: any) => {
          const data = e.payload.doc.data();
          data.id = e.payload.doc.id;
          return data;
        },
        () => {
          alert('Error while fetching tweets');
        }
      );

      this.tweets = this.tweets.filter((tweet) => {
        return (
          this.user.following.includes(tweet.userId) ||
          this.user.following.includes(tweet.userId?.toString()) ||
          this.user.id == tweet.userId
        );
      });

      this.tweets.sort((a, b) =>
        new Date(a.createdAt) < new Date(b.createdAt) ? 1 : -1
      );
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
      .then((downloadURL) => {
        this.tweet.image = downloadURL;
        this.dataURL = downloadURL;
      })
      .catch((error) => {
        console.error('Error uploading image:', error);
      });
  }

  upload() {
    this.tweet.content = this.uploadForm.content.toString();
    this.tweet.userId = this.user.id;
    this.uploadForm.image = '';
    this.uploadForm.content = '';
    this.dataService.addTweet(this.tweet).then(()=>{
      this.toastr.success('uploaded');
      this.clearImage();
      this.ngOnInit();
    });
  }
  clearImage() {
    this.dataURL = '';
  }

  onImport(vitalSignsDataModal: any) {
    this.modalService.dismissAll();
    this.modalService.open(vitalSignsDataModal, { size: 'lg', centered: true });
    this.service.getTrendingGifs();
    this.subscription = this.service.getGifs().subscribe((res) => {
      this.gifs = res;
    });
  }
  searchGif(searchTerm: any) {
    if (searchTerm !== '') {
      this.service.searchGifs(searchTerm);
      this.subscription = this.service.getGifs().subscribe((res) => {
        this.gifs = res;
      });
    }
  }
  selectGif(gif: any) {
    this.tweet.image = gif.images.original.url;
    this.dataURL = gif.images.original.url;

    this.modalService.dismissAll();
  }

  navigateToProfile(userId: string | number): void {
    this.router.navigate(['/profile', userId]);
  }
  onWindowScroll() {
    const appShell = document.querySelector('.app-shell');
    const scrollPos = appShell ? appShell.scrollTop : window.scrollY;
    if (scrollPos > 400) {
      this.showButton = true;
    } else {
      this.showButton = false;
    }
  }

  scrollToTop() {
    const appShell = document.querySelector('.app-shell');
    if (appShell) {
      appShell.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Wait for the smooth scroll animation to finish before loading tweets
    setTimeout(() => {
      this.loadTweets();
    }, 500);
  }
  
}



