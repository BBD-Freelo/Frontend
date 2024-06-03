import { Component } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatLabel } from '@angular/material/form-field';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ MatToolbar, MatButtonModule, MatIconModule, MatLabel],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  profileUrl: string = '';

  constructor(private authService: AuthService) {
   this.getProfileUrl();
  }

  async getProfileUrl() {
    this.profileUrl = await this.authService.getProfileUrl();
  }
}
