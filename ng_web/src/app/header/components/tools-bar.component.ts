import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tools-bar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './tools-bar.component.html',
  styleUrls: ['./tools-bar.component.css'],
  host: {ngSkipHydration: 'true'}
})
export class ToolsBarComponent {
  @Input() activeTab = 'viewer';
  @Output() tabChanged = new EventEmitter<string>();

  // Navigation method for setting active tab
  setActiveTab(tabName: string): void {
    this.activeTab = tabName;
    this.tabChanged.emit(tabName);
  }
}