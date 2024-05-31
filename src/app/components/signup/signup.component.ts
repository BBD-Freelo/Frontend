import { Component } from '@angular/core';
import { signUp } from 'aws-amplify/auth';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Regex } from '../../../enums/regex';

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

  async onSubmit(form: any) {
      const { email, password } = form.value;
      this.signupError = null;
      if (this.passwordFormControl.invalid || this.emailFormControl.invalid) {
        return;
      };
      try {
       const { isSignUpComplete } = await signUp({
        username: email,
        password: password,
       });
       console.log('Sign up success!', isSignUpComplete);
      } catch (error: any) {
        this.signupError = error.message;
      }
    }
}