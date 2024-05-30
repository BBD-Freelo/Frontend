import { Component } from '@angular/core';
import { signUp } from 'aws-amplify/auth';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
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
