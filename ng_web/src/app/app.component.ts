import { HeaderThemeService } from './services/header-theme.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { ProjectGridComponent } from './admin/tools/project-grid.component';
import { AuthService } from './services/auth.service';
import { User } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { DynamicHeaderThemeDirective } from './shared/directives/dynamic-header-theme.directive';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, ProjectGridComponent, DynamicHeaderThemeDirective],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  host: {ngSkipHydration: 'true'},
})
export class AppComponent implements OnInit {
  showMenu = false;
  activeTab = 'viewer'; // default tab
  sliderImages = [
    'assets/img5.jpg',
    'assets/img7.jpg',
    'assets/img6.JPG'
  ];
  sliderGradients = [
    
  'linear-gradient(145deg,  #fadbadff 0%, #f4a679e5 30%, #3c1955ff 100%)',  // img5.jpg (orange & black)
  'linear-gradient(75deg, #682d10f4 0%, #f8f5ebf1 50%, #bb5114e5 100%)', // img7.jpg  
  'linear-gradient(155deg, #66b7ea 0%, #4b92a2 50%, #93fbe4 100%)'  // img6.JPG
  ];
  currentSlide = 0;
  fadingOutIndex: number | null = null;
  transitionMs = 600;
  title = 'eBusiness';
  // Authentication properties
  user$: Observable<User | null>;

  constructor(
    private authService: AuthService,
    private router: Router,
    private headerThemeService: HeaderThemeService
  ) {
    this.preloadImages();
    this.user$ = this.authService.user$;
    // Emit initial gradient
    this.headerThemeService.setTheme(this.sliderGradients[this.currentSlide]);
  }

  ngOnInit() {
    // You can add any initialization logic here
  }

  preloadImages() {
    this.sliderImages.forEach(src => {
      const img = new Image();
      img.src = src; // browser caches; reduces flicker when showing
    });
  }

  // When image is clicked, advance to the next image (or choose behavior here)
  onImageClick(index: number) {
    const next = (index + 1) % this.sliderImages.length;
    if (next === this.currentSlide) return; // no change
    this.fadingOutIndex = this.currentSlide;
    this.currentSlide = next;
    // Emit new gradient to service
    this.headerThemeService.setTheme(this.sliderGradients[this.currentSlide]);
    setTimeout(() => {
      // clear fading out after animation completes
      if (this.fadingOutIndex === this.fadingOutIndex) {
        this.fadingOutIndex = null;
      }
    }, this.transitionMs);
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