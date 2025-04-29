import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OrderService } from 'src/app/services/order.service';
import { Order, OrderProduct } from 'src/app/Models/Order.Model';
declare var bootstrap: any;

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {
  
  statuses : string[]=[]; // Adapt to your app statuses
  selectedStatus: string = '';
  orders: Order[] = [];
  orderproducts!: OrderProduct[];
  private modal: any;

  constructor(private http: HttpClient, private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
    this.statuses = ['PENDING', 'DELIVERED', 'SHIPPED', 'CANCELLED']; // Adapt to your app statuses

  }

  loadOrders(): void {
    this.orderService.getAllOrders().subscribe(orders => {
      this.orders = orders;
    });
  }

  openModal(order: Order): void {
    this.orderproducts = order.orderProducts;
    this.modal = new bootstrap.Modal(document.getElementById('detailsModal'));
    this.modal.show();
  }

  closeModal(): void {
    if (this.modal) {
      this.modal.hide();
    }
  }

  filteredOrders(): Order[] {
    console.log("I selected" + this.selectedStatus);
    console.log(this.orders.filter(order => order.status === this.selectedStatus));
    if (!this.selectedStatus) {
      return this.orders;
    }
    return this.orders.filter(order => order.status === this.selectedStatus);
  }
}
