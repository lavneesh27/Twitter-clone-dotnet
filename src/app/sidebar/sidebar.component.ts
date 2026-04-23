import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { DataService } from '../shared/data.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  constructor(private router: Router, private data: DataService, private toastr: ToastrService) {}
  peoples: User[] = [];
  inputUser: string = '';
  user: any;
  isPeoplesLoading: boolean = true;
  hoverState: string | number | null = null;
  async ngOnInit() {
    const userToken =
      sessionStorage.getItem('token') ?? localStorage.getItem('token');

    if (userToken) {
      this.user = await this.data.getUser(userToken);

      this.isPeoplesLoading=true;
      this.data.getAllUsers().subscribe((res: any) => {
        this.peoples = res
          .map(
            (e: any) => {
              const data = e.payload.doc.data();
              data.id = e.payload.doc.id;

              return data;
            },
            () => {
              alert('Error while fetching users');
            }
          )
          .filter((people: User) => people.userName !== this.user.userName);
          this.isPeoplesLoading=false;
      });
    }
  }

  filter(searchText: string) {
    this.data.getAllUsers().subscribe((res: any) => {
      this.peoples = res
        .map(
          (e: any) => {
            const data = e.payload.doc.data();
            data.id = e.payload.doc.id;

            return data;
          },
          () => {
            alert('Error while fetching users');
          }
        )
        .filter((user: User) => {
          return (
            (user.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
              user.userName.toLowerCase().includes(searchText.toLowerCase())) &&
            user.userName !== this.user.userName
          );
        });
    });
  }
  isFollower(user: User): boolean {
    const followers = user.followers;

    return (
      !!followers &&
      !!followers.length &&
      !!this.user &&
      followers.includes(this.user.id.toString())
    );
  }
  navigateToProfile(userId: string | number): void {
    this.router.navigate(['/profile', userId]);
  }

  follow(userId: string | number) {
    this.data.follow(this.user.id, userId);
    this.toastr.success('Follow Successull');
  }
  unFollow(userId: string | number) {
    this.data.unFollow(this.user.id, userId);
    this.toastr.success('Unfollow Successull');
  }
}
