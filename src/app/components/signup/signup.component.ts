import { Component } from '@angular/core';
import { signUp } from 'aws-amplify/auth';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatLabel, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  async onSubmit(form: any) {
      const { email, password } = form.value;
      try {
       const { isSignUpComplete } = await signUp({
        username: email,
        password: password,
       });
       console.log('Sign up success!', isSignUpComplete);
      } catch (error) {
       console.error('Error signing up:', error);
      }
    }
}
