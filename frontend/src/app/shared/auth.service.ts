import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {}
  login(email: string, password: string, remember: boolean): Promise<string | null> {
    return firstValueFrom(this.http.post<{ token: number | string; user: User }>(`${this.baseUrl}/auth/login`, { email, password }))
      .then((res) => {
        const userId = res.token?.toString() || null;
        if (userId) {
          this.router.navigate(['home']);
          remember
            ? localStorage.setItem('token', userId)
            : sessionStorage.setItem('token', userId);

          setTimeout(() => {
            window.location.reload();
          }, 80);
        }
        return userId;
      })
      .catch(err => {
        this.toastr.error(
          err.status === 0
            ? 'Server Error'
            : err.error || (err.status === 401 ? 'Invalid email or password.' : err.message)
        );
        return null;
      });
  }
  
  register(user: User): Promise<boolean> {
    return firstValueFrom(this.http.post<User>(`${this.baseUrl}/auth/register`, user))
      .then(
        (res) => {
          this.toastr.success('Registration Successful');
          this.router.navigate(['login']);
          return true;
        },
        (err) => {
          this.toastr.error(err.error || err.message);
          this.router.navigate(['/register']);
          return false;
        }
      );
  }

  logout() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    this.router.navigate(['login']);
  }

  googleSignIn() {
    this.toastr.info('Google sign-in is not configured for the .NET API yet.');
    return Promise.resolve();
  }

  forgotPassword(email: string) {
    firstValueFrom(this.http.post(`${this.baseUrl}/auth/forgot-password`, { email }, { responseType: 'text' })).then(
      () => {
        this.toastr.info('Password reset is not configured for the local .NET API yet.');
        this.router.navigate(['login'])
      },
      (_err) => {
        this.toastr.error('Something went wrong');
      }
    );
  }
}



