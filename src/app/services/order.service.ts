import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../Models/Order.Model';

export interface OrderForm {
  productOrders: {
    product: { idProduit: number };
    quantity: number;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = 'http://localhost:8081/commande'; 

  constructor(private http: HttpClient) { }
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
  createOrder(orderForm: OrderForm): Observable<any> {
    return this.http.post(`${this.baseUrl}`, orderForm,{ headers: this.getHeaders() });
  }
  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.baseUrl,{ headers: this.getHeaders() });
  }
  getAllOrdersback(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/backoffice`,{ headers: this.getHeaders() });
  }
  updateOrder(id: number, order: Order): Observable<Order> {
    return this.http.put<Order>(`${this.baseUrl}/${id}`, order);
  }

  // Supprimer une commande
  deleteOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`,{ headers: this.getHeaders()});
  }

  async getOrderTotalPrice(orderId: number): Promise<number> {
    const response = await this.http.get<{ totalPrice: number }>(
      `${this.baseUrl}/api/orders/${orderId}/total-price`
    ).toPromise();
    
    if (!response?.totalPrice) {
      throw new Error('Could not retrieve order total price');
    }
    return response.totalPrice;
  }
  
  getOrderDetails(orderId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/orders/${orderId}`);
  }

  downloadInvoice(orderId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${orderId}/invoice`, {
      responseType: 'blob'
    });
  }
}
