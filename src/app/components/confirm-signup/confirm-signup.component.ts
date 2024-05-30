import { Component } from '@angular/core';
import { confirmSignUp, ConfirmSignUpInput } from 'aws-amplify/auth';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: 'app-confirm-signup',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './confirm-signup.component.html',
  styleUrl: './confirm-signup.component.css'
})
export class ConfirmSignupComponent {
  async onSubmit(form: any) {
    const { email, code } = form.value;
  
    let user : ConfirmSignUpInput = {
      username: email,
      confirmationCode: code 
    };
  
    try {
      const output = await confirmSignUp(user);
      console.log('Confirmation success!', output);
    } catch (error) {
      console.error('Error confirming sign up:', error);
    }
  }
}
