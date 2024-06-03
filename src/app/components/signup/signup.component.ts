import { Component } from '@angular/core';
import { signUp } from 'aws-amplify/auth';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Regex } from '../../../enums/regex';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatLabel, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  passwordFormControl = new FormControl('', [Validators.required, Validators.minLength(8)]);
  emailFormControl = new FormControl('', [Validators.required, Validators.pattern(Regex.Email)]);
  signupError: string | null = null;

  constructor(private router: Router){

  }

  async onSubmit(form: any) {

    this.signupError = null;
    if (this.passwordFormControl.invalid || this.emailFormControl.invalid) {
      return;
    };
    try {
      if (this.emailFormControl.value !== null && this.passwordFormControl.value) {
        const { isSignUpComplete } = await signUp({
          username: this.emailFormControl.value,
          password: this.passwordFormControl.value,
          });
          
          this.router.navigate(['/confirm-signup']);
      }
    } catch (error: any) {
      this.signupError = error.message;
    }
  }

  navigateToLogIn(){
    this.router.navigate(['/login']);
  }
}
