import {
  AfterViewInit,
  Component,
  ElementRef,
  TemplateRef,
  ViewChild,
  inject,
} from '@angular/core';
import { ChatService } from '../shared/chat.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../shared/data.service';
import { Location } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Chat } from '../models/chat.model';
import { MainService } from '../shared/main.service';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UploadService } from '../shared/upload.service';

@Component({
  selector: 'app-chat',
  standalone: false,
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent {
  private modalService = inject(NgbModal);
  @ViewChild('chatBody') myDiv: ElementRef | undefined;
  @ViewChild('myInput') myInput: ElementRef | undefined;

  subscription: any;
  gifs: any[] = [];
  message: Chat = {
    id: 0,
    senderId: 0,
    recieverId: 0,
    text: '',
    createdAt: '',
    attachment: '',
  };
  messages: any[] = [];
  reciever: any;
  user: any;
  showButton: boolean = false;
  isChatsLoading = true;
  isRecieverLoading = true;

  constructor(
    private chatService: ChatService,
    private aRoute: ActivatedRoute,
    private data: DataService,
    private _location: Location,
    private route: Router,
    private service: MainService,
    private toastr: ToastrService,
    private ngxService: NgxUiLoaderService,
    private uploadService: UploadService
  ) {}
  async ngOnInit() {
    this.isRecieverLoading = true;
    this.messages = [];
    this.aRoute.params.subscribe(async (params) => {
      this.reciever = await this.data.getUser(params['uuid']);
      this.isRecieverLoading = false;
    });

    this.user = await this.data.getUser(
      sessionStorage.getItem('token') || localStorage.getItem('token')!
    );

    if (!this.user) {
      this.route.navigate(['login']);
    }
    this.ngxService.start();
    this.isChatsLoading = true;
    this.chatService.getMessages().subscribe((res) => {
      if (!this.user?.id || !this.reciever?.id) {
        return;
      }

      this.messages = res
      .filter((msg: any) => 
        (msg.recieverId === this.reciever.id && msg.senderId === this.user.id) ||
        (msg.recieverId === this.user.id && msg.senderId === this.reciever.id)
      )
      .sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      this.isChatsLoading = false;
      if(this.messages.length){
        setTimeout(() => {
          if (this.myDiv) {
            this.scrollToBottom();
          }
        }, 500);
        this.ngxService.stop();
      }else{
        this.ngxService.stop();
      }
    });

    this.chatService.newMessageReceived.subscribe((msg: any) => {
      if (!this.user?.id || !this.reciever?.id) {
        return;
      }

      if (
        (msg.recieverId === this.reciever.id && msg.senderId === this.user.id) ||
        (msg.recieverId === this.user.id && msg.senderId === this.reciever.id)
      ) {
        if (!this.messages.find(m => m.id === msg.id)) {
          this.messages.push(msg);
          setTimeout(() => {
            if (this.myDiv) {
              this.scrollToBottom();
            }
          }, 100);
        }
      }
    });

    if (this.myInput) {
      this.myInput.nativeElement.focus();
    }

  }

  sendMessage() {
    if (this.message!.text == '' && this.message!.attachment == '') {
      alert('Please enter some message');
      return;
    }
    this.chatService.sendMessage(this.message, this.reciever.id);
    this.message = {
      id: 0,
      senderId: 0,
      recieverId: 0,
      text: '',
      createdAt: '',
      attachment: '',
    };
  }
  goBack() {
    this._location.back();
  }
  navigateToProfile(userId: string | number): void {
    this.route.navigate(['/profile', userId]);
  }
  clear() {
    this.chatService.clearMessages(this.messages);
    this.toastr.success('Chats Cleared!');
    this.modalService.dismissAll();
  }
  open(content: TemplateRef<any>) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
      size: 'sm',
      windowClass: 'dark-modal',
      animation: false
    });
  }
  onImport(vitalSignsDataModal: any) {
    this.modalService.dismissAll();
    this.modalService.open(vitalSignsDataModal, { size: 'lg', centered: true, animation: false });
    this.service.getTrendingGifs();
    this.subscription = this.service.getGifs().subscribe((res) => {
      this.gifs = res;
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
        this.message!.attachment = downloadURL;
        this.sendMessage();
      })
      .catch((error) => {
        console.error('Error uploading image:', error);
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
    this.message.attachment = gif.images.original.url;
    this.sendMessage();
    this.modalService.dismissAll();
  }
  onChatScroll() {
    if (!this.myDiv) {
      return;
    }

    const chatBody = this.myDiv.nativeElement;
    const isAtBottom =
      chatBody.scrollTop + chatBody.clientHeight >= chatBody.scrollHeight - 8;

    this.showButton = !isAtBottom;
  }

  scrollToBottom() {
    this.myDiv?.nativeElement.scrollTo({
      top: this.myDiv.nativeElement.scrollHeight,
      behavior: 'smooth',
    });
  }
}
