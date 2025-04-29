import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {
  revenue = 0;
  orderCount = 0;
  averageOrderValue = 0;
  topProducts: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<number>('http://localhost:8081/api/stats/revenue').subscribe(data => this.revenue = data);
    this.http.get<number>('http://localhost:8081/api/stats/orders/count').subscribe(data => this.orderCount = data);
    this.http.get<number>('http://localhost:8081/api/stats/orders/average').subscribe(data => this.averageOrderValue = data);
    this.http.get<any[]>('http://localhost:8081/api/stats/products/top').subscribe(data => this.topProducts = data);
  }
}
