import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { HeaderThemeService, HeaderTheme } from '../../services/header-theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-project-grid',
  standalone: true,
  templateUrl: './project-grid.component.html',
  styleUrls: ['./project-grid.component.css'],
  imports: [CommonModule]
})
export class ProjectGridComponent implements OnDestroy {
  projects = [
    {
      projectID: "Abby's Mansion",
      clientName: 'Abby Smith',
      address: 'abc ln Irving TX USA',
      status: ['Meeting Scheduled', 'Order details pending', 'Design In Progress', 'Material Purchased', 'Deployment In Progress'],
      action: ['Complete', 'Mark Complete', 'Mark Complete', 'Initiate'],
    },
    {
      projectID: 'Remote Villa',
      clientName: 'John Doe',
      address: 'XYZ st Dallas TX USA',
      status: ['Planning', 'Active', 'Inactive'],
      action: ['Start', 'Complete', 'Start']
    }
    // Add more rows as needed
  ];
  backgroundGradient = 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)';
  buttonTextColor = 'white';
  private themeSub: Subscription;

  constructor(private headerThemeService: HeaderThemeService) {
    this.themeSub = this.headerThemeService.theme$.subscribe((theme: HeaderTheme) => {
      this.backgroundGradient = theme.gradient;
      // Set button text color based on gradient
      this.buttonTextColor = this.getButtonTextColor(theme.gradient);
    });
  }

  private getButtonTextColor(gradient: string): string {
    // For gradients with white/light shades, use black text
    if (/f[0-9a-f]{5}f[0-9a-f]/i.test(gradient)) {
      return 'black';
    }
    // Default to white for all other gradients
    return 'white';
  }

  ngOnDestroy(): void {
    if (this.themeSub) {
      this.themeSub.unsubscribe();
    }
  }
}
