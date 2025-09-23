import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService, Order } from '../services/order.service';
import { HeaderThemeService, HeaderTheme } from '../services/header-theme.service';
import { Subscription } from 'rxjs';
import { SchedulerComponent, SchedulerData } from '../scheduler';

interface ToolItem {
  id: string;
  type: 'scheduler' | 'order-form';
  name: string;
  icon: string;
  description: string;
}

interface DroppedItem {
  id: string;
  toolId: string;
  type: 'scheduler' | 'order-form';
  name: string;
  icon: string;
  x: number;
  y: number;
  width: number;
  height: number;
  expanded: boolean;
  collapsedHeight: number;
}

@Component({
  selector: 'app-ebizFlow',
  standalone: true,
  imports: [CommonModule, FormsModule, SchedulerComponent],
  templateUrl: './ebizFlow.component.html',
  styleUrls: ['./ebizFlow.component.css']
})
export class EbizFlowComponent implements OnInit, OnDestroy {
  
  tools: ToolItem[] = [
    {
      id: 'scheduler-tool',
      type: 'scheduler',
      name: 'Scheduler',
      icon: '📅',
      description: 'Add scheduling functionality'
    },
    {
      id: 'order-form-tool',
      type: 'order-form',
      name: 'Order Form',
      icon: '✉️',
      description: 'Add order detail form'
    }
  ];

  droppedItems: DroppedItem[] = [];
  draggedTool: ToolItem | null = null;
  draggedItem: DroppedItem | null = null;
  selectedItem: DroppedItem | null = null;
  isDragging: boolean = false;
  isDragOver: boolean = false;
  selectedMode: string = 'create-new';
  droppingAreas: any[] = [];
  maxAreas: number = 5; // First 5 are numbered, 6th is add button
  expandedWidget: any = null; // Track which widget is expanded
  
  // Order form properties
  orderDetails = {
    orderNumber: '',
    customerName: '',
    customerEmail: '',
    orderDate: '',
    deliveryDate: '',
    items: '',
    notes: ''
  };

  // Scheduler properties
  schedulerData: SchedulerData = {
    eventTitle: '',
    eventDate: '',
    eventTime: '',
    duration: '60',
    participants: ''
  };

  backgroundGradient = 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)';
  areaNumberTextColor = 'white';
  private themeSub: Subscription;

  constructor(private orderService: OrderService, private headerThemeService: HeaderThemeService) {
    this.themeSub = this.headerThemeService.theme$.subscribe((theme: HeaderTheme) => {
      this.backgroundGradient = theme.gradient;
      // Set area number text color based on gradient
      this.areaNumberTextColor = this.getAreaNumberTextColor(theme.gradient);
    });
  }

  private getAreaNumberTextColor(gradient: string): string {
    // For img7 gradient, use black text when gradient contains white/light shades
    if ( /f[0-9a-f]{5}f[0-9a-f]/i.test(gradient)) {
      return 'black';
    }
    // Default to white for all other gradients
    return 'white';
  }

  ngOnInit(): void {
    // Initialize dropping areas
    this.initializeDroppingAreas();
  }

  ngOnDestroy(): void {
    if (this.themeSub) {
      this.themeSub.unsubscribe();
    }
  }

  initializeDroppingAreas(): void {
    this.droppingAreas = [];
    for (let i = 1; i <= this.maxAreas; i++) {
      this.droppingAreas.push({
        id: i,
        number: i,
        hasContent: false,
        droppedItem: null
      });
    }
  }

  addNewDroppingArea(): void {
    const newId = this.droppingAreas.length + 1;
    this.droppingAreas.push({
      id: newId,
      number: newId,
      hasContent: false,
      droppedItem: null
    });
  }

  hasAnyContent(): boolean {
    return this.droppingAreas.some(area => area.hasContent);
  }

  onAreaDragOver(event: DragEvent, area: any): void {
    event.preventDefault();
    
    if (event.dataTransfer) {
      if (this.draggedTool) {
        // Tool dropping - only allow if area is empty
        event.dataTransfer.dropEffect = area.hasContent ? 'none' : 'copy';
      } else if (this.draggedItem) {
        // Widget moving - always allow (can swap or move to empty)
        event.dataTransfer.dropEffect = 'move';
      }
    }
  }

  onAreaDragEnter(event: DragEvent, area: any): void {
    event.preventDefault();
    
    if (this.draggedItem) {
      area.isDragOver = true;
    }
  }

  onAreaDragLeave(event: DragEvent, area: any): void {
    // Only clear drag over if we're actually leaving the area
    const target = event.currentTarget as HTMLElement;
    const related = event.relatedTarget as HTMLElement;
    if (!target?.contains(related)) {
      area.isDragOver = false;
    }
  }

  onAreaDrop(event: DragEvent, area: any): void {
    event.preventDefault();
    event.stopPropagation();
    
    console.log('Drop event triggered', { draggedTool: this.draggedTool, draggedItem: this.draggedItem, targetArea: area.number });
    
    if (this.draggedTool && !area.hasContent) {
      // Drop tool in area
      const newItem = {
        id: this.generateId(),
        toolId: this.draggedTool.id,
        type: this.draggedTool.type,
        name: this.draggedTool.name,
        icon: this.draggedTool.icon,
        areaId: area.id,
        expanded: true, // Start expanded by default
        width: this.draggedTool.type === 'scheduler' ? 300 : 400,
        height: this.draggedTool.type === 'scheduler' ? 200 : 350,
        collapsedHeight: 40
      };
      
      area.hasContent = true;
      area.droppedItem = newItem;
      
      console.log(`Dropped ${newItem.name} in area ${area.number}`);
    } else if (this.draggedItem) {
      // Moving widget between areas - find source area
      const sourceArea = this.droppingAreas.find(a => a.droppedItem && a.droppedItem.id === this.draggedItem!.id);
      
      if (sourceArea && sourceArea.id !== area.id) {
        console.log(`Moving widget from area ${sourceArea.number} to area ${area.number}`);
        
        if (!area.hasContent) {
          // Move widget to empty area
          area.hasContent = true;
          area.droppedItem = { ...this.draggedItem, areaId: area.id };
          
          // Clear source area
          sourceArea.hasContent = false;
          sourceArea.droppedItem = null;
          
          console.log(`Moved ${this.draggedItem.name} from area ${sourceArea.number} to area ${area.number}`);
        } else {
          // Swap widgets if target area has content
          const targetItem = area.droppedItem;
          
          area.droppedItem = { ...this.draggedItem, areaId: area.id };
          sourceArea.droppedItem = { ...targetItem, areaId: sourceArea.id };
          
          console.log(`Swapped ${this.draggedItem.name} and ${targetItem.name} between areas ${sourceArea.number} and ${area.number}`);
        }
      }
    }
    
    // Clear drag over state
    area.isDragOver = false;
    
    this.draggedTool = null;
    this.draggedItem = null;
  }

  toggleAreaItemExpanded(area: any): void {
    if (area.droppedItem) {
      area.droppedItem.expanded = !area.droppedItem.expanded;
      console.log(`${area.droppedItem.expanded ? 'Expanded' : 'Collapsed'} ${area.droppedItem.name} in area ${area.number}`);
    }
  }

  onAreaItemDelete(area: any): void {
    if (area.droppedItem) {
      console.log(`Deleted ${area.droppedItem.name} from area ${area.number}`);
      area.droppedItem = null;
      area.hasContent = false;
    }
  }

  expandWidget(area: any): void {
    if (area.droppedItem) {
      this.expandedWidget = {
        ...area.droppedItem,
        areaNumber: area.number
      };
      console.log(`Expanded ${area.droppedItem.name} from area ${area.number}`);
    }
  }

  closeExpandedWidget(): void {
    this.expandedWidget = null;
  }

  onDragStart(event: DragEvent, tool: ToolItem): void {
    this.draggedTool = tool;
    this.draggedItem = null; // Clear any item being dragged
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'copy';
      event.dataTransfer.setData('text/plain', tool.id);
      event.dataTransfer.setData('drag-type', 'tool');
    }
    console.log('Started dragging tool:', tool.name);
  }

  onWidgetDragStart(event: DragEvent, area: any): void {
    console.log('Widget drag start called', { area: area.number, item: area.droppedItem?.name });
    
    if (area.droppedItem) {
      this.draggedItem = area.droppedItem;
      this.draggedTool = null; // Clear any tool being dragged
      
      // Clear any existing drag over states
      this.droppingAreas.forEach(a => a.isDragOver = false);
      
      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', area.droppedItem.id);
        event.dataTransfer.setData('drag-type', 'widget');
        event.dataTransfer.setData('source-area', area.id);
      }
      console.log(`Started dragging widget: ${area.droppedItem.name} from area ${area.number}`);
    } else {
      console.log('No dropped item found in area');
    }
  }

  onWidgetDragEnd(event: DragEvent): void {
    console.log('Widget drag ended');
    // Clear all drag over states
    this.droppingAreas.forEach(area => area.isDragOver = false);
    this.draggedItem = null;
    this.draggedTool = null;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) {
      // Set default drop effect based on what's being dragged
      if (this.draggedItem) {
        event.dataTransfer.dropEffect = 'move';
      } else if (this.draggedTool) {
        event.dataTransfer.dropEffect = 'copy';
      } else {
        event.dataTransfer.dropEffect = 'copy';
      }
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    console.log('onDrop triggered');
    
    const dragType = event.dataTransfer?.getData('drag-type');
    const id = event.dataTransfer?.getData('text/plain');
    
    console.log('Drag type:', dragType, 'ID:', id);
    console.log('Dragged tool:', this.draggedTool);
    console.log('Dragged item:', this.draggedItem);
    
    if (!id) {
      console.log('No ID found in drag data');
      return;
    }

    const dropZone = event.currentTarget as HTMLElement;
    const rect = dropZone.getBoundingClientRect();
    const x = Math.max(0, event.clientX - rect.left - 50);
    const y = Math.max(0, event.clientY - rect.top - 25);

    console.log('Drop position:', x, y);

    if (dragType === 'tool' && this.draggedTool) {
      console.log('Handling tool drop');
      this.handleToolDrop(x, y);
    } else if (dragType === 'item' && this.draggedItem) {
      console.log('Handling item reposition');
      this.handleItemReposition(x, y);
    } else {
      console.log('No matching drag type handler');
    }

    // Clean up
    this.draggedTool = null;
    this.draggedItem = null;
    this.isDragging = false;
  }

  private handleToolDrop(x: number, y: number): void {
    if (!this.draggedTool) return;

    const fullHeight = this.draggedTool.type === 'scheduler' ? 200 : 350;
    const newItem: DroppedItem = {
      id: this.generateId(),
      toolId: this.draggedTool.id,
      type: this.draggedTool.type,
      name: this.draggedTool.name,
      icon: this.draggedTool.icon,
      x: x,
      y: y,
      width: this.draggedTool.type === 'scheduler' ? 300 : 400,
      height: fullHeight,
      expanded: true,
      collapsedHeight: 40
    };

    this.droppedItems.push(newItem);
    console.log('Added new item:', newItem.name);
  }

  private handleItemReposition(x: number, y: number): void {
    if (!this.draggedItem) return;

    // Get workspace dimensions for boundary checking
    const workspaceElement = document.querySelector('.workspace') as HTMLElement;
    const workspaceRect = workspaceElement?.getBoundingClientRect();
    
    const maxX = workspaceRect ? workspaceRect.width - this.draggedItem.width : 800;
    const maxY = workspaceRect ? workspaceRect.height - this.draggedItem.height : 600;

    this.draggedItem.x = Math.max(0, Math.min(x, maxX));
    this.draggedItem.y = Math.max(0, Math.min(y, maxY));
    
    console.log(`Repositioned ${this.draggedItem.name} to (${this.draggedItem.x}, ${this.draggedItem.y})`);
  }

  selectItem(item: DroppedItem): void {
    this.selectedItem = item;
  }

  deleteItem(item: DroppedItem): void {
    this.droppedItems = this.droppedItems.filter(i => i.id !== item.id);
    if (this.selectedItem?.id === item.id) {
      this.selectedItem = null;
    }
  }

  onItemDragStart(event: DragEvent, item: DroppedItem): void {
    event.stopPropagation();
    console.log('onItemDragStart triggered for:', item.name);
    
    this.draggedItem = item;
    this.draggedTool = null; // Clear any tool being dragged
    this.isDragging = true;
    
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', item.id);
      event.dataTransfer.setData('drag-type', 'item');
      console.log('Set drag data - ID:', item.id, 'Type: item');
    }
    
    console.log('Started dragging item:', item.name);
  }

  toggleItemExpanded(item: DroppedItem): void {
    item.expanded = !item.expanded;
    if (item.expanded) {
      // Restore original height
      item.height = item.type === 'scheduler' ? 200 : 350;
    } else {
      // Collapse to header only
      item.height = item.collapsedHeight;
    }
    console.log(`${item.expanded ? 'Expanded' : 'Collapsed'} ${item.name}`);
  }

  stopPropagation(event: Event): void {
    event.stopPropagation();
  }

  onModeChange(): void {
    console.log('Mode changed to:', this.selectedMode);
    // Add logic here to handle different modes
    switch(this.selectedMode) {
      case 'create-new':
        // Handle create new mode
        break;
      case 'edit-existing':
        // Handle edit existing mode
        break;
      case 'view-templates':
        // Handle view templates mode
        break;
    }
  }

  saveOrder(): void {
    const orderData = {
      orderDetails: this.orderDetails,
      schedulerData: this.schedulerData,
      layout: this.droppedItems
    };
    
    console.log('Saving order:', orderData);
    // Here you would typically send the data to a service
    alert('Order saved successfully!');
  }

  onSchedulerDataChange(data: SchedulerData): void {
    this.schedulerData = data;
    console.log('Scheduler data updated:', data);
  }

  onSchedulerDelete(item: DroppedItem): void {
    this.deleteItem(item);
  }

  clearWorkspace(): void {
    this.droppedItems = [];
    this.selectedItem = null;
  }

  private generateId(): string {
    return 'item_' + Math.random().toString(36).substr(2, 9);
  }
}
