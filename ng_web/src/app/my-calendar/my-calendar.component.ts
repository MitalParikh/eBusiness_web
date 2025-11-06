import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-my-calendar',
  templateUrl: './my-calendar.component.html',
  host: {ngSkipHydration: 'true'},
  styleUrls: ['./my-calendar.component.css']
})

export class CalendarComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    initialView: 'timeGridWeek', // Or 'dayGridMonth', etc.
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin], // Add necessary plugins
    editable: true, // Enable drag-and-drop event manipulation
    selectable: true, // Allow selecting date/time ranges
    dateClick: this.handleDateClick.bind(this),
    events: [
      // Example events
      { title: 'Appointment 1', date: '2025-08-20T10:00:00', end: '2025-08-20T11:00:00' },
      { title: 'Appointment 2', date: '2025-08-22T14:30:00', end: '2025-08-22T15:00:00' }
    ],
    eventClick: this.handleEventClick.bind(this),
    eventDrop: this.handleEventDrop.bind(this), // Handle drag-and-drop of events
    eventResize: this.handleEventResize.bind(this) // Handle resizing events
  };

  constructor() { }

  ngOnInit(): void { }

  handleDateClick(arg: any) {
    // Implement logic for creating new appointments
    alert('Date clicked: ' + arg.dateStr);
  }

  handleEventClick(arg: any) {
    // Implement logic for viewing/editing appointment details
    alert('Event clicked: ' + arg.event.title);
  }

  handleEventDrop(info: any) {
    // Handle event drag-and-drop: update appointment start/end dates in your data source
    console.log('Event dropped:', info.event.title, info.event.start, info.event.end);
  }

  handleEventResize(info: any) {
    // Handle event resize: update appointment end date in your data source
    console.log('Event resized:', info.event.title, info.event.start, info.event.end);
  }
}
