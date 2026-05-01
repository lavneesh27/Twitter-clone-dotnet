import { Component, HostListener } from '@angular/core';
import { User } from '../models/user.model';
import { Tweet } from '../models/tweet.model';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../shared/data.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UploadService } from '../shared/upload.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  user!: any;
  tweets: Tweet[] = [];
  updateForm!: FormGroup;
  isAdmin: boolean = false;
  isLoading: boolean = true;
  loginUser: any;
  countries: any;
  showButton: boolean = false;
  uid: string = "";
  hoverState: string | null = null;
  showProfileImage: boolean = false;
  showCoverImage: boolean = false;
  get createdAtDate(): Date | null {
    return this.toDate(this.user?.createdAt);
  }

  constructor(
    private _location: Location,
    private router: Router,
    private fb: FormBuilder,
    private data: DataService,
    private toastr: ToastrService,
    private ngxService: NgxUiLoaderService,
    private aRoute: ActivatedRoute,
    private uploadService: UploadService
  ) {}
  async ngOnInit() {
    this.ngxService.start();
    let userId;
    this.aRoute.params.subscribe(async (params) => {
      userId = params['uuid'];

      this.uid =
        userId ||
        sessionStorage.getItem('token') ||
        localStorage.getItem('token') ||
        '';

      if (!this.uid) {
        this.router.navigate(['login']);
        return;
      }
      this.loginUser = await this.data.getUser(
        sessionStorage.getItem('token') ?? localStorage.getItem('token')!
      );
      this.user = await this.data.getUser(this.uid);
      this.isAdmin =
        userId ==
        (sessionStorage.getItem('token') ?? localStorage.getItem('token')!);
      this.initializeForm();

      this.loadTweets();
      this.ngxService.stop();
      setTimeout(() => {
        this.isLoading = false;
      }, 500);
    });
    fetch('./assets/files/countries.json')
      .then((res) => res.json())
      .then((json) => {
        this.countries = Object.keys(json);
      });
  }
  loadTweets(){
    this.data.getAllTweets().subscribe((res: any) => {
      this.tweets = res
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
        .filter((tweet: Tweet) => {
          return tweet.userId == this.user.id;
        });
      this.tweets.sort((a, b) =>
        new Date(a.createdAt) < new Date(b.createdAt) ? 1 : -1
      );
    });
  }
  goBack() {
    this._location.back();
  }
  update() {
    this.user.firstName = this.updateForm.get('firstName')?.value;
    this.user.lastName = this.updateForm.get('lastName')?.value;
    this.user.dob = this.updateForm.get('dob')?.value;
    this.user.userName = this.updateForm.get('userName')?.value;
    this.user.email = this.updateForm.get('email')?.value;
    this.user.bio = this.updateForm.get('bio')?.value;
    this.user.location = this.updateForm.get('location')?.value;
    this.user.website = this.updateForm.get('website')?.value;
    try {
      this.data.updateUser(this.user);
      setTimeout(() => {
        window.location.reload();
        this.toastr.success('Profile Updated');
      }, 500);
    } catch (err) {
      this.toastr.error('Some error occurred');
    }
  }

  initializeForm() {
    this.updateForm = this.fb.group({
      firstName: [
        this.user.firstName,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern('[a-zA-Z].*'),
        ],
      ],
      lastName: [
        this.user.lastName,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern('[a-zA-Z].*'),
        ],
      ],
      bio: [this.user.bio],
      location: [this.user.location],
      website: [this.user.website],
      email: [this.user.email, [Validators.required, Validators.email]],
      dob: [this.user.dob],
      userName: [
        this.user.userName,
        [Validators.required, Validators.minLength(2)],
      ],
    });
  }

  private toDate(value: unknown): Date | null {
    if (!value) {
      return null;
    }

    if (value instanceof Date) {
      return value;
    }

    if (typeof value === 'object' && 'toDate' in value && typeof (value as any).toDate === 'function') {
      return (value as any).toDate();
    }

    if (typeof value === 'string') {
      const ddMmYyyy = value.match(/^(\d{2})-(\d{2})-(\d{4})$/);

      if (ddMmYyyy) {
        const [, day, month, year] = ddMmYyyy;
        return new Date(Number(year), Number(month) - 1, Number(day));
      }

      const parsed = new Date(value);
      return Number.isNaN(parsed.getTime()) ? null : parsed;
    }

    return null;
  }

  onFileSelected(event: any, type?: any) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    if (!file.type.startsWith('image/')) {
      alert('Please select only image files.');
      return;
    }

    this.uploadService.uploadImage(file)
      .then((downloadURL) => {
        this.user[type === 'banner' ? 'banner' : 'image'] = downloadURL;
      })
      .catch((error) => {
        console.error('Error uploading image:', error);
      });
  }
  clearBanner() {
    this.user.banner = './assets/images/banner_solid.png';
  }
  isFollower(user: User): boolean {
    const followers = user?.followers;

    return (
      !!followers &&
      !!followers.length &&
      !!this.user &&
      followers.includes(this.loginUser.id.toString())
    );
  }
  follow(userId: string | number) {
    this.data.follow(this.loginUser.id, userId).then(async () => {
      this.user = await this.data.getUser(this.uid);
      this.toastr.success('Follow Successull');
    });
  }
  unFollow(userId: string | number) {
    this.data.unFollow(this.loginUser.id, userId).then(async () => {
      this.user = await this.data.getUser(this.uid);
      this.toastr.success('Unfollow Successull');
    });
  }
  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (window.scrollY > 400) {
      this.showButton = true;
    } else {
      this.showButton = false;
    }
  }

  scrollToTop() {
    this.loadTweets();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  redirect(id: string | number) {
    this.router.navigate(['post', id]);
  }
  copy() {
    navigator.clipboard
      .writeText('http://localhost:4200/profile/' + this.user.id)
      .then(() => {
        this.toastr.success('Copied to Clipboard');
      });
  }
}
