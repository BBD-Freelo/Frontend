import { Component } from '@angular/core';
import { FormControl, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { signIn } from 'aws-amplify/auth';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Regex } from '../../../enums/regex';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatLabel, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  passwordFormControl = new FormControl('', [Validators.required, Validators.minLength(8)]);
  emailFormControl = new FormControl('', [Validators.required, Validators.pattern(Regex.Email)]);
  loginError: string | null = null;

  email: string = '';
  password: string = '';

  constructor() {

  }

  async signInUser(){
    this.loginError = null;
    if (this.passwordFormControl.invalid || this.emailFormControl.invalid) {
      return;
    };
    try {
      await signIn({
        username: this.email,
        password: this.password
      });
      console.log("Login successful");
    } catch (err: any) {
      this.loginError = err.message;
    }
  }

}
