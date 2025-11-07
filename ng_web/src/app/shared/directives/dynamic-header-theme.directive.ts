import { Directive, ElementRef, afterRender , effect, Renderer2, Signal, signal, input } from '@angular/core';
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
        console.log("changing header theme index");
        this.el.nativeElement.style.background = this.dynamicHeaderTheme();
        this.el.nativeElement.style.color = /f[0-9a-f]{5}f[0-9a-f]/i.test(this.dynamicHeaderTheme()) ? 'black' : 'white';
      });
    }

    dynamicHeaderTheme = input<string>('');
}