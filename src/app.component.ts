
import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, LoginComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  authService = inject(AuthService);
  // Removed local showLoginModal signal, using authService's instead
  showUserMenu = signal<boolean>(false);

  openLogin() {
    this.authService.showLoginModal.set(true);
  }

  closeLogin() {
    this.authService.showLoginModal.set(false);
  }

  toggleUserMenu() {
    this.showUserMenu.update(v => !v);
  }

  logout() {
    this.authService.logout();
    this.showUserMenu.set(false);
  }
}
