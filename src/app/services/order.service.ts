import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  createOrder(orderForm: OrderForm): Observable<any> {
    return this.http.post(this.baseUrl, orderForm);
  }
}
