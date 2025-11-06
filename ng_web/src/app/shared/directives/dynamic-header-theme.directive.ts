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
        // this.theme.set((HeaderTheme as any).this.headerThemeService.themeKey().value);
        this.el.nativeElement.style.background = this.gradient();
        // this.renderer.setStyle(this.el.nativeElement, 'color', /f[0-9a-f]{5}f[0-9a-f]/i.test(this.theme.gradient) ? 'black' : 'white');
      });
    }

    gradient = input<string>('');
}