import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { signIn } from 'aws-amplify/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  email: string = '';
  password: string = '';

  constructor() {

  }

  async signInUser(){
    try {
      await signIn({
        username: this.email,
        password: this.password
      });
    } catch (err) {
      console.log("Error signing In : ", err);
    }
  }

}
