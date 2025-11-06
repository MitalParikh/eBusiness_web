import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  orderDate: string;
  deliveryDate: string;
  items: string;
  notes: string;
  status: 'draft' | 'pending' | 'confirmed' | 'shipped' | 'delivered';
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderLayout {
  orderId: string;
  layout: any[];
  schedulerData: any;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  
  private orders: Order[] = [];
  private orderLayouts: OrderLayout[] = [];
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  
  constructor() {
    // Initialize with some sample data
    this.initializeSampleData();
  }

  getOrders(): Observable<Order[]> {
    return this.ordersSubject.asObservable();
  }

  createOrder(orderData: any, layout: any[], schedulerData: any): Order {
    const newOrder: Order = {
      id: this.generateId(),
      orderNumber: orderData.orderNumber || this.generateOrderNumber(),
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      orderDate: orderData.orderDate,
      deliveryDate: orderData.deliveryDate,
      items: orderData.items,
      notes: orderData.notes,
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.orders.push(newOrder);
    
    // Save layout
    const orderLayout: OrderLayout = {
      orderId: newOrder.id,
      layout: layout,
      schedulerData: schedulerData,
      createdAt: new Date()
    };
    
    this.orderLayouts.push(orderLayout);
    
    this.ordersSubject.next([...this.orders]);
    
    return newOrder;
  }

  updateOrder(orderId: string, updates: Partial<Order>): Order | null {
    const orderIndex = this.orders.findIndex(order => order.id === orderId);
    
    if (orderIndex === -1) {
      return null;
    }

    this.orders[orderIndex] = {
      ...this.orders[orderIndex],
      ...updates,
      updatedAt: new Date()
    };

    this.ordersSubject.next([...this.orders]);
    
    return this.orders[orderIndex];
  }

  deleteOrder(orderId: string): boolean {
    const orderIndex = this.orders.findIndex(order => order.id === orderId);
    
    if (orderIndex === -1) {
      return false;
    }

    this.orders.splice(orderIndex, 1);
    
    // Remove associated layout
    const layoutIndex = this.orderLayouts.findIndex(layout => layout.orderId === orderId);
    if (layoutIndex !== -1) {
      this.orderLayouts.splice(layoutIndex, 1);
    }

    this.ordersSubject.next([...this.orders]);
    
    return true;
  }

  getOrderById(orderId: string): Order | null {
    return this.orders.find(order => order.id === orderId) || null;
  }

  getOrderLayout(orderId: string): OrderLayout | null {
    return this.orderLayouts.find(layout => layout.orderId === orderId) || null;
  }

  private generateId(): string {
    return 'order_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  private generateOrderNumber(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    return `ORD-${year}${month}${day}-${random}`;
  }

  private initializeSampleData(): void {
    // Add some sample orders for demonstration
    const sampleOrders: Order[] = [
      {
        id: 'sample_1',
        orderNumber: 'ORD-20250904-001',
        customerName: 'John Doe',
        customerEmail: 'john.doe@example.com',
        orderDate: '2025-09-04',
        deliveryDate: '2025-09-10',
        items: 'Widget A (qty: 2), Widget B (qty: 1)',
        notes: 'Express delivery requested',
        status: 'confirmed',
        createdAt: new Date('2025-09-04T10:00:00'),
        updatedAt: new Date('2025-09-04T10:30:00')
      },
      {
        id: 'sample_2',
        orderNumber: 'ORD-20250904-002',
        customerName: 'Jane Smith',
        customerEmail: 'jane.smith@example.com',
        orderDate: '2025-09-04',
        deliveryDate: '2025-09-12',
        items: 'Product X (qty: 1), Product Y (qty: 3)',
        notes: 'Standard delivery',
        status: 'pending',
        createdAt: new Date('2025-09-04T11:15:00'),
        updatedAt: new Date('2025-09-04T11:15:00')
      }
    ];

    this.orders = [...sampleOrders];
    this.ordersSubject.next([...this.orders]);
  }
}
