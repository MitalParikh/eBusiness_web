import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { User } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { ImageSliderComponent } from './components/image-slider.component';
import { ToolsBarComponent } from './components/tools-bar.component';
import { DynamicHeaderThemeDirective } from '../shared/directives/dynamic-header-theme.directive';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, ImageSliderComponent, ToolsBarComponent, DynamicHeaderThemeDirective],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  activeTab = 'viewer'; // default tab

  // Authentication properties
  user$: Observable<User | null>;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.user$ = this.authService.user$;
  }

  ngOnInit(): void {
    // Component initialization logic if needed
  }

  // Handle tab change event from tools bar
  onTabChanged(tabName: string): void {
    this.activeTab = tabName;
  }

  // Authentication methods
  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  async logout(): Promise<void> {
    try {
      await this.authService.signOut();
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
}