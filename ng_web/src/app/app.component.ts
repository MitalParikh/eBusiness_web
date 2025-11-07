import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { ProjectGridComponent } from './admin/tools/project-grid.component';
import { HeaderComponent } from './header/header.component';
import { AuthService } from './services/auth.service';
import { User } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { DynamicHeaderThemeDirective } from './shared/directives/dynamic-header-theme.directive';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, ProjectGridComponent, HeaderComponent,DynamicHeaderThemeDirective],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  host: {ngSkipHydration: 'true'},
})
export class AppComponent implements OnInit {
  showMenu = false;
  activeTab = 'viewer'; // default tab
  
  title = 'eBusiness';
  // Authentication properties
  user$: Observable<User | null>;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.user$ = this.authService.user$;
  }

  ngOnInit() {
    // You can add any initialization logic here
  }

  // Authentication methods
  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  async logout() {
    try {
      await this.authService.signOut();
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
}