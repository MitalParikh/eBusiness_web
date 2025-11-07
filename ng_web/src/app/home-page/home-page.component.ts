import { Component, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicHeaderThemeDirective } from '../shared/directives';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, DynamicHeaderThemeDirective],
  host: {ngSkipHydration: 'true'},
  template: `
    <div class="home-page" [DynamicHeaderTheme]="backgroundGradient()">
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
export class HomePageComponent {
  backgroundGradient = signal<string>('');

  constructor() {}
}