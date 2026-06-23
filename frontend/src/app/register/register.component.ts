import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { User } from '../models/user.model';
import { Location } from '@angular/common';
import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';
import { UploadService } from '../shared/upload.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  image: any;
  submitted: boolean = false;
  isLoading: boolean = false;
  constructor(
    private fb: FormBuilder,
    private _location: Location,
    private auth: AuthService,
    private router: Router,
    private uploadService: UploadService,
    private toastr: ToastrService
  ) {}
  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        firstName: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.pattern('[a-zA-Z].*'),
          ],
        ],
        lastName: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.pattern('[a-zA-Z].*'),
          ],
        ],
        email: ['', [Validators.required, Validators.email]],
        dob: [''],
        userName: ['', [Validators.required, Validators.minLength(2)]],
        password: [
          '',
          [
            Validators.required,
            Validators.pattern('^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).*$'),
            Validators.minLength(6),
          ],
        ],
        rPassword: ['', Validators.required],
        image: [''],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }
  passwordMatchValidator(formGroup: FormGroup) {
    const passwordControl = formGroup.get('password');
    const repeatPasswordControl = formGroup.get('rPassword');

    if (passwordControl?.value !== repeatPasswordControl?.value) {
      repeatPasswordControl?.setErrors({ passwordMismatch: true });
    } else {
      repeatPasswordControl?.setErrors(null);
    }
  }

  register() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
   
    let user: User = {
      id: 0,
      firstName: this.FirstName.value,
      lastName: this.LastName.value,
      bio:'',
      website:'',
      location:'',
      banner:'./assets/images/banner_solid.png',
      email: this.Email.value,
      password: this.Password.value,
      dob: this.DOB.value.toString(),
      userName: this.UserName.value,
      image: this.image ? this.image : '',
      createdAt: '',
      followers:[],
      following:[],
      defaultPrimaryColor: ''
    };
    this.isLoading = true;
    this.auth.register(user).then(() => {
      this.isLoading = false;
    }).catch(() => {
      this.isLoading = false;
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    if (!file.type.startsWith('image/')) {
      this.toastr.warning('Please select only image files.');
      return;
    }

    this.uploadService.uploadImage(file)
      .then((downloadURL) => {
        this.image = downloadURL;
      })
      .catch((error) => {
        console.error('Error uploading image:', error);
      });
  }

  goBack() {
    this._location.back();
  }

  get FirstName(): FormControl {
    return this.registerForm.get('firstName') as FormControl;
  }
  get LastName(): FormControl {
    return this.registerForm.get('lastName') as FormControl;
  }
  get Email(): FormControl {
    return this.registerForm.get('email') as FormControl;
  }
  get DOB(): FormControl {
    return this.registerForm.get('dob') as FormControl;
  }
  get UserName(): FormControl {
    return this.registerForm.get('userName') as FormControl;
  }
  get Password(): FormControl {
    return this.registerForm.get('password') as FormControl;
  }
  get RPassword(): FormControl {
    return this.registerForm.get('rPassword') as FormControl;
  }
}
