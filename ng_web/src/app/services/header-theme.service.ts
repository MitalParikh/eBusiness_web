import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface HeaderTheme {
  gradient: string;
}

@Injectable({ providedIn: 'root' })
export class HeaderThemeService {
  private themeSubject = new BehaviorSubject<HeaderTheme>({
    gradient: 'linear-gradient(135deg, #66b7ea 0%, #4b92a2 50%, #93fbe4 100%)'
  });
  theme$ = this.themeSubject.asObservable();

  setTheme(gradient: string) {
    this.themeSubject.next({ gradient });
  }
}
