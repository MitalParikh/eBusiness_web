import { Directive, ElementRef, effect} from '@angular/core';
import { HeaderThemeService } from '../../header/services/header-theme.service';


@Directive({
  selector: '[dynamicHeaderTheme]',
  standalone: true
})
export class DynamicHeaderThemeDirective {
 
  constructor(
    private el: ElementRef,
    private headerThemeService: HeaderThemeService,
  ) {
      effect(() => {
        const value = this.headerThemeService.gradientSignal();
        console.log("changing header theme gradient", value);
        this.el.nativeElement.style.background = value;
        this.el.nativeElement.style.color = /f[0-9a-f]{5}f[0-9a-f]/i.test(value) ? 'black' : 'white';
      });
    }
}