import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {
  orders: any[] = [];
  statuses = ['PENDING', 'PAID', 'SHIPPED', 'CANCELLED']; // adapt to your statuses
  selectedStatus: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    let url = '/api/orders/my-orders';
    if (this.selectedStatus) {
      url += `?status=${this.selectedStatus}`;
    }
    this.http.get<any[]>(url).subscribe(data => {
      this.orders = data;
    });
  }

  onStatusChange() {
    this.loadOrders();
  }
}
