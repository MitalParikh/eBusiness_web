import { Injectable, WritableSignal, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
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
  
  private themeEntries: ThemeEntry[] = HeaderThemeEntries.headerThemeEntries;
  /*(() => {
    const raw = (HeaderTheme as any) ?? {};
    const entries: ThemeEntry[] = [];

    // initializeThemeData() {
    // If the JSON export is an array
    if (Array.isArray(raw)) {
      raw.forEach((item: any, idx: number) => {
        entries.push({
          img: item?.img ?? '',
          gradient: item?.gradient ?? '',
          themeKey: item?.themeKey ?? item?.themeName ?? String(idx)
        });
      });
      console.log("entries : ", entries.forEach(entry => console.log(JSON.stringify(entry))));
      return entries;
    }

    return [{ img: raw.img, gradient: raw.gradient, themeKey: 'default' }];
  })();*/


  public updateThemeKey(themekey: string): void {
    this._themeKey.set(themekey);
  }

  private themeEntry(): ThemeEntry | undefined {
    return this.themeEntries.find(entry => entry.themeKey === this.themeKey());
  }

  public gradient(): string {
    const entry = this.themeEntry();
    console.log("entry : ", JSON.stringify(entry));
    return entry ? entry.gradient : this.themeEntries[0].gradient;
  }

}
