import { Component } from '@angular/core';
import { confirmSignUp, ConfirmSignUpInput } from 'aws-amplify/auth';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Regex } from '../../../enums/regex';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirm-signup',
  standalone: true,
  imports: [FormsModule,MatButtonModule, MatFormFieldModule, MatInputModule, MatLabel, ReactiveFormsModule],
  templateUrl: './confirm-signup.component.html',
  styleUrl: './confirm-signup.component.css'
})
export class ConfirmSignupComponent {

  constructor(private router: Router){
     
  }

  emailFormControl = new FormControl('', [Validators.required, Validators.pattern(Regex.Email)]);
  codeFormControl = new FormControl('', [Validators.required]);
  confirmationError: string | null = null;
  async onSubmit(form: any) {
    this.confirmationError = null;
    if (this.codeFormControl.invalid || this.emailFormControl.invalid) {
      return;
    };  
    try {
        if (this.emailFormControl.value !== null && this.codeFormControl.value !== null) {
          let user : ConfirmSignUpInput = {
            username: this.emailFormControl.value,
            confirmationCode: this.codeFormControl.value 
          };
          const output = await confirmSignUp(user);
          console.log('Confirmation success!', output);
          this.router.navigate(['/login']);
        }
    } catch (error: any) {
      this.confirmationError = error.message;
    }
  }
}
