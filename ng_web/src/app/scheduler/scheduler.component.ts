import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface SchedulerData {
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  duration: string;
  participants: string;
}

@Component({
  selector: 'app-scheduler',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.css']
})
export class SchedulerComponent {
  @Input() schedulerData: SchedulerData = {
    eventTitle: '',
    eventDate: '',
    eventTime: '',
    duration: '60',
    participants: ''
  };

  @Input() showHeader: boolean = true;
  @Input() showDeleteButton: boolean = true;
  @Input() expanded: boolean = true;
  @Input() title: string = 'Scheduler';
  @Input() icon: string = '📅';

  @Output() dataChange = new EventEmitter<SchedulerData>();
  @Output() deleteClick = new EventEmitter<void>();
  @Output() expandToggle = new EventEmitter<void>();

  onDataChange(): void {
    this.dataChange.emit(this.schedulerData);
  }

  onDelete(): void {
    this.deleteClick.emit();
  }

  onExpandToggle(): void {
    this.expandToggle.emit();
  }

  // Convenience methods for form validation
  get isValid(): boolean {
    return !!(this.schedulerData.eventTitle && 
              this.schedulerData.eventDate && 
              this.schedulerData.eventTime);
  }

  get validationErrors(): string[] {
    const errors: string[] = [];
    if (!this.schedulerData.eventTitle) {
      errors.push('Event title is required');
    }
    if (!this.schedulerData.eventDate) {
      errors.push('Event date is required');
    }
    if (!this.schedulerData.eventTime) {
      errors.push('Event time is required');
    }
    return errors;
  }

  // Helper method to get formatted date-time
  get formattedDateTime(): string {
    if (this.schedulerData.eventDate && this.schedulerData.eventTime) {
      const date = new Date(`${this.schedulerData.eventDate}T${this.schedulerData.eventTime}`);
      return date.toLocaleString();
    }
    return '';
  }

  // Helper method to get duration label
  get durationLabel(): string {
    const minutes = parseInt(this.schedulerData.duration);
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      if (remainingMinutes === 0) {
        return `${hours} hour${hours > 1 ? 's' : ''}`;
      } else {
        return `${hours}h ${remainingMinutes}m`;
      }
    }
    return `${minutes} minutes`;
  }
}
