import { Component, effect, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderThemeService, ThemeEntry} from '../services/header-theme.service';

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
  currentThemeKey = signal('');


  sliderImages: ThemeEntry[] = []
  
  fadingOutImgKey: string | null = null;
  transitionMs = 600;

  constructor(private headerThemeService: HeaderThemeService) {
    // effect(() => {
    //   const newKey = this.currentThemeKey();
    //   console.log('ImageSliderComponent: currentThemeKey changed to', newKey);
    //   this.headerThemeService.updateThemeKey(this.currentThemeKey());
    // });

  }

  ngOnInit(): void {
    this.sliderImages = this.headerThemeService.getKeyedImages();
    console.log('ImageSliderComponent: loaded sliderImages', this.sliderImages.length);
    this.currentThemeKey.set(this.headerThemeService.themeKey());
  }

  // When image is clicked, advance to the next image
  onImageClick(changedThemeKey: string): void {
    console.log('ImageSliderComponent: changing to theme key', changedThemeKey);
    setTimeout(() => {
      // clear fading out after animation completes
      if (changedThemeKey === this.fadingOutImgKey) {
        this.fadingOutImgKey = null;
      }
    }, this.transitionMs);
    this.currentThemeKey.update(() => changedThemeKey);
    this.headerThemeService.updateThemeKey(changedThemeKey);
    
  }
}