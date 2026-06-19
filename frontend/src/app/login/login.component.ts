import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { AuthService } from '../shared/auth.service';
import { MainService } from '../shared/main.service';
import { DataService } from '../shared/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  remember: boolean = false;
  email: string = '';
  password: string = '';
  showPassword: boolean = false;
  constructor(private _location: Location, private auth: AuthService, private main: MainService, private data: DataService) {}

  login() {
    if (this.email == '') {
      alert('Please enter email');
      return;
    }

    if (this.password == '') {
      alert('Please enter password');
      return;
    }

    this.auth.login(this.email, this.password, this.remember).then(async token=>{
      if (token) {
        this.main.loginUserObject = await this.data.getUser(token);
      }
    })
  }

  goBack() {
    this._location.back();
  }
}



