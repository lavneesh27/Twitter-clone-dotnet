import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../shared/data.service';
import { MainService } from '../shared/main.service';
import { colors } from '../models/user.model';
import { ChatService } from '../shared/chat.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  user?: any;
  imgUrl: any;
  unreadMessagesCount = 0;
  private modalService = inject(NgbModal);
  colors: any[] = colors;
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private data: DataService,
    private chat: ChatService
  ) {}
  async ngOnInit() {
    this.chat.unreadTotal$.subscribe((count) => {
      this.unreadMessagesCount = count;
    });

    let uid = sessionStorage.getItem('token') ?? localStorage.getItem('token');
    if (uid) {
      this.user = await this.data.getUser(uid);
      this.chat.refreshUnreadCounts();

      if (this.user?.defaultPrimaryColor) {
        const { color, secColor } = JSON.parse(this.user.defaultPrimaryColor);
        document.documentElement.style.setProperty('--twitter-primary', color);
        document.documentElement.style.setProperty('--twitter-secondary', secColor);
      }

      if (this.user?.darkMode) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    }
  }
  
  logout() {
    sessionStorage.clear();
    localStorage.clear();
    this.modalService.dismissAll();
    this.router.navigate(['/login']).then(() => {
      setTimeout(() => {
        window.location.reload();
      }, 300);
      this.toastr.success('Logout Successful');
    });
  }

  login() {
    this.router.navigate(['/login']);
  }
  open(content: TemplateRef<any>, type: string) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
      size: type == 'logout' ? 'sm' : 'md',
      windowClass: 'dark-modal'
    });
  }
  changeColor(colorObj: any) {
    this.user.defaultPrimaryColor = JSON.stringify(colorObj);

    document.documentElement.style.setProperty('--twitter-primary', colorObj.color);
    document.documentElement.style.setProperty('--twitter-secondary', colorObj.secColor);

    this.data.updateUser(this.user);
    this.toastr.success('Color set Successfully');
  }

  toggleDarkMode() {
    this.user.darkMode = !this.user.darkMode;
    if (this.user.darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    this.data.updateUser(this.user);
    this.toastr.success('Theme updated successfully');
  }
}



