import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DynamicHeaderThemeDirective } from '../../shared/directives/dynamic-header-theme.directive';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-project-grid',
  standalone: true,
  templateUrl: './project-grid.component.html',
  styleUrls: ['./project-grid.component.css'],
  host: {ngSkipHydration: 'true'},
  imports: [CommonModule, DynamicHeaderThemeDirective]
})
export class ProjectGridComponent {
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
  
  constructor() {}
}
