import { Component } from '@angular/core';
import { confirmSignUp, ConfirmSignUpInput } from 'aws-amplify/auth';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Regex } from '../../../enums/regex';

@Component({
  selector: 'app-confirm-signup',
  standalone: true,
  imports: [FormsModule,MatButtonModule, MatFormFieldModule, MatInputModule, MatLabel, ReactiveFormsModule],
  templateUrl: './confirm-signup.component.html',
  styleUrl: './confirm-signup.component.css'
})
export class ConfirmSignupComponent {
  emailFormControl = new FormControl('', [Validators.required, Validators.pattern(Regex.Email)]);
  codeFormControl = new FormControl('', [Validators.required]);
  confirmationError: string | null = null;
  async onSubmit(form: any) {
    this.confirmationError = null;
    if (this.codeFormControl.invalid || this.emailFormControl.invalid) {
      return;
    };
    const { email, code } = form.value;
  
    let user : ConfirmSignUpInput = {
      username: email,
      confirmationCode: code 
    };
  
    try {
      const output = await confirmSignUp(user);
      console.log('Confirmation success!', output);
    } catch (error: any) {
      this.confirmationError = error.message;
    }
  }
}
