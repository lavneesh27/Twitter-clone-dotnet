import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CreateComponent } from './create/create.component';
import { ProfileComponent } from './profile/profile.component';
import { BookmarkComponent } from './bookmark/bookmark.component';
import { ChatComponent } from './chat/chat.component';
import { MessagesComponent } from './messages/messages.component';
import { PostComponent } from './post/post.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, title: 'Home / Twitter' },
  { path: 'login', component: LoginComponent, title: 'Login / Twitter' },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Register / Twitter',
  },
  { path: 'create', component: CreateComponent, title: 'Create / Twitter' },
  {
    path: 'profile/:uuid',
    component: ProfileComponent,
    title: 'Profile / Twitter',
  },
  {
    path: 'bookmark',
    component: BookmarkComponent,
    title: 'Bookmark / Twitter',
  },
  { path: 'chat/:uuid', component: ChatComponent, title: 'Chat / Twitter' },
  {
    path: 'messages',
    component: MessagesComponent,
    title: 'Messages / Twitter',
  },
  { path: 'post/:id', component: PostComponent, title: 'Post / Twitter' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
