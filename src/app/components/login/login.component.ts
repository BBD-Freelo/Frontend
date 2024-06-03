import { Component } from '@angular/core';
import { FormControl, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { signIn } from 'aws-amplify/auth';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Regex } from '../../../enums/regex';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatLabel, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  passwordFormControl = new FormControl('', [Validators.required, Validators.minLength(8)]);
  emailFormControl = new FormControl('', [Validators.required, Validators.pattern(Regex.Email)]);
  loginError: string | null = null;

  email: string = '';
  password: string = '';

  constructor(private router: Router){
     
  }

  async signInUser(){
    this.loginError = null;
    if (this.passwordFormControl.invalid || this.emailFormControl.invalid) {
      return;
    }
    try {
      const email = this.emailFormControl.value;
      const password = this.passwordFormControl.value;

      if (email && password) {

        const user = await signIn({
          username: email,
          password: password
        });

        this.router.navigate(['/board/1']);
      }
    } catch (err: any) {

      this.loginError = err.message;
    }
  }

  navigateToSignUp(){
    this.router.navigate(['/signup']);
  }

}
