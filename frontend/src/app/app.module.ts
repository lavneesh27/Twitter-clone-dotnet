import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { NavComponent } from './nav/nav.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateComponent } from './create/create.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ProfileComponent } from './profile/profile.component';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BookmarkComponent } from './bookmark/bookmark.component';
import { CardComponent } from './card/card.component';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StartComponent } from './start/start.component';
import { ChatComponent } from './chat/chat.component';
import { CommonModule } from '@angular/common';
import { MessagesComponent } from './messages/messages.component';
import { PostComponent } from './post/post.component';
import { SkeletonComponent } from './skeleton/skeleton.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    CardComponent,
    CreateComponent,
    SidebarComponent,
    ProfileComponent,
    BookmarkComponent,
    StartComponent,
    ChatComponent,
    MessagesComponent,
    PostComponent,
    SkeletonComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 1000,
    }),
    NgbModule,
    NgbModalModule,
    CommonModule,
    HttpClientJsonpModule,
  ],
  providers: [ToastrService],
  bootstrap: [AppComponent],
})
export class AppModule {}



