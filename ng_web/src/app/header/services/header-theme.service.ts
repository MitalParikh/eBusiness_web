import { Injectable, WritableSignal, signal } from '@angular/core';
import * as HeaderThemeEntries from '../../../environments/headerTheme';

export interface ThemeEntry {
  img: string;
  gradient: string;
  themeKey: string;
}

@Injectable({ providedIn: 'root' })

export class HeaderThemeService {
  private _themeKey: WritableSignal<string> = signal('default');
  public themeKey = this._themeKey.asReadonly();

  private _gradient: WritableSignal<string> = signal('');
  public gradientSignal = this._gradient.asReadonly();
  
  private themeEntries: ThemeEntry[] = HeaderThemeEntries.headerThemeEntries;
  
  public getKeyedImages(): ThemeEntry[] {
    return this.themeEntries;
  }

  public updateThemeKey(themekey: string): void {
    console.log("HeaderThemeService: updating theme key to", themekey);
    this._themeKey.set(themekey);
    this.updateGradient();
  }

  private updateGradient(): void {
    const entry = this.themeEntry();
    this._gradient.set(entry ? entry.gradient : this.themeEntries[0].gradient);
  }

  private themeEntry(): ThemeEntry | undefined {
    return this.themeEntries.find(entry => entry.themeKey === this.themeKey());
  }

  

}
