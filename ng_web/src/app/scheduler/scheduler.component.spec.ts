import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { SchedulerComponent } from './scheduler.component';

describe('SchedulerComponent', () => {
  let component: SchedulerComponent;
  let fixture: ComponentFixture<SchedulerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchedulerComponent, FormsModule]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default scheduler data', () => {
    expect(component.schedulerData).toBeDefined();
    expect(component.schedulerData.eventTitle).toBe('');
    expect(component.schedulerData.duration).toBe('60');
  });

  it('should emit dataChange when data is modified', () => {
    spyOn(component.dataChange, 'emit');
    
    component.schedulerData.eventTitle = 'Test Event';
    component.onDataChange();
    
    expect(component.dataChange.emit).toHaveBeenCalledWith(component.schedulerData);
  });

  it('should emit deleteClick when delete is called', () => {
    spyOn(component.deleteClick, 'emit');
    
    component.onDelete();
    
    expect(component.deleteClick.emit).toHaveBeenCalled();
  });

  it('should validate required fields correctly', () => {
    // Initially invalid
    expect(component.isValid).toBeFalsy();
    
    // Add required fields
    component.schedulerData.eventTitle = 'Test Event';
    component.schedulerData.eventDate = '2025-09-05';
    component.schedulerData.eventTime = '10:00';
    
    expect(component.isValid).toBeTruthy();
  });

  it('should return correct validation errors', () => {
    const errors = component.validationErrors;
    expect(errors).toContain('Event title is required');
    expect(errors).toContain('Event date is required');
    expect(errors).toContain('Event time is required');
  });

  it('should format duration correctly', () => {
    component.schedulerData.duration = '60';
    expect(component.durationLabel).toBe('1 hour');
    
    component.schedulerData.duration = '90';
    expect(component.durationLabel).toBe('1h 30m');
    
    component.schedulerData.duration = '30';
    expect(component.durationLabel).toBe('30 minutes');
  });

  it('should format date-time correctly', () => {
    component.schedulerData.eventDate = '2025-09-05';
    component.schedulerData.eventTime = '14:30';
    
    const formatted = component.formattedDateTime;
    expect(formatted).toContain('2025');
    expect(formatted).toContain('14:30');
  });

  it('should show/hide header based on input', () => {
    component.showHeader = false;
    fixture.detectChanges();
    
    const headerElement = fixture.nativeElement.querySelector('.widget-header');
    expect(headerElement).toBeNull();
    
    component.showHeader = true;
    fixture.detectChanges();
    
    const headerElementShown = fixture.nativeElement.querySelector('.widget-header');
    expect(headerElementShown).toBeTruthy();
  });

  it('should show/hide delete button based on input', () => {
    component.showDeleteButton = false;
    fixture.detectChanges();
    
    const deleteButton = fixture.nativeElement.querySelector('.delete-btn');
    expect(deleteButton).toBeNull();
    
    component.showDeleteButton = true;
    fixture.detectChanges();
    
    const deleteButtonShown = fixture.nativeElement.querySelector('.delete-btn');
    expect(deleteButtonShown).toBeTruthy();
  });
});
