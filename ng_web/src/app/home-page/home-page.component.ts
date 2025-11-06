import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderThemeService, HeaderTheme } from '../services/header-theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule],
  host: {ngSkipHydration: 'true'},
  template: `
    <div class="home-page" [ngStyle]="{'background': backgroundGradient}">
      <h2>Welcome to eBusiness!</h2>
      <p>This is the home page of your application.</p>
    </div>
  `,
  styles: [`
    .home-page {
      width: 100vw;
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      text-align: center;
    }
  `]
})
export class HomePageComponent implements OnDestroy {
  backgroundGradient = 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)';
  private themeSub: Subscription;

  constructor(private headerThemeService: HeaderThemeService) {
    this.themeSub = this.headerThemeService.theme$.subscribe((theme: HeaderTheme) => {
      this.backgroundGradient = theme.gradient;
    });
  }

  ngOnDestroy(): void {
    if (this.themeSub) {
      this.themeSub.unsubscribe();
    }
  }
}