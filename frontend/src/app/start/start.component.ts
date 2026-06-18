import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css'],
})
export class StartComponent {
  loginForm!: FormGroup;
  remember: boolean = false;
  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private auth: AuthService
  ) {}
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      pwd: ['', Validators.required],
    });
  }
  onImport(vitalSignsDataModal: any) {
    this.modalService.dismissAll();
    this.modalService.open(vitalSignsDataModal, { size: 'lg', centered: true });
  }
  lo() {
    if (this.loginForm.get('email')!.value == '') {
      alert('Please enter email');
      return;
    }

    if (this.loginForm.get('email')!.value== '') {
      alert('Please enter password');
      return;
    }

    this.auth.login(this.loginForm.get('email')!.value, this.loginForm.get('pwd')!.value, false);
    this.loginForm.reset();
  }

  get Email(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }
  get PWD(): FormControl {
    return this.loginForm.get('pwd') as FormControl;
  }


  googleSignIn(){
    return this.auth.googleSignIn();
  }
}
