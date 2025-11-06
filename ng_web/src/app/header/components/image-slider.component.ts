import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderThemeService } from '../services/header-theme.service';
import * as HeaderTheme from '../../../../public/assets/headerTheme.json';

interface HeaderThemeEntry {
  [key: string]: { img: string; gradient: string };
}

@Component({
  selector: 'app-image-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-slider.component.html',
  host: {ngSkipHydration: 'true'},
  styleUrls: ['./image-slider.component.css']
})

export class ImageSliderComponent implements OnInit {
  // @Output() slideChanged = new EventEmitter<number>();
  currentThemeKey = signal('default');


  headerTheme: HeaderThemeEntry[] = []
  
  fadingOutImgKey: string | null = null;
  transitionMs = 600;

  constructor(private headerThemeService: HeaderThemeService) {
    // this.preloadImages();
  }

  ngOnInit(): void {
    this.headerTheme = (HeaderTheme as any).default;
  }

  // preloadImages(): void {
  //   let sliderImages = HeaderTheme.map(item => Object.values(item)[0].img).concat();
  //   sliderImages.forEach(src => {
  //     const img = new Image();
  //     img.src = src; // browser caches; reduces flicker when showing
  //   });
  // }

  // When image is clicked, advance to the next image
  onImageClick(currThemeKey: string): void {
    console.log('ImageSliderComponent: onImageClick - changing to theme key', currThemeKey);
    setTimeout(() => {
      // clear fading out after animation completes
      if (currThemeKey === this.fadingOutImgKey) {
        this.fadingOutImgKey = null;
      }
    }, this.transitionMs);
    this.currentThemeKey.set(currThemeKey);
    this.headerThemeService.updateThemeKey(this.currentThemeKey());
  }
}