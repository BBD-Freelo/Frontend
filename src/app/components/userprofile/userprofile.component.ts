import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-userprofile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './userprofile.component.html',
  styleUrl: './userprofile.component.css'
})
export class UserprofileComponent implements OnInit {

  user: any = null;
  session: any = null;

  constructor(private authService: AuthService) {

  }

  ngOnInit(): void {
      this.loadUserData();
  }

  async loadUserData() {
    try {
      this.user = await this.authService.getCurrentUser();
      this.session = await this.authService.getUserSession();
    } catch (err) {
      console.log('Error loading user data: ', err);
    }
  }

}
