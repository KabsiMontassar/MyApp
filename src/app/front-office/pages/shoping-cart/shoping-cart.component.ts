import { Component, OnInit } from '@angular/core';
import { CartService, CartItem } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-cart',
  templateUrl: './shoping-cart.component.html',
  styleUrls: ['./shoping-cart.component.css']
})
export class ShopingCartComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalPrice: number = 0;

  constructor(private cartService: CartService, private orderService: OrderService) { }

  ngOnInit(): void {
    this.cartService.getCart().subscribe((items: CartItem[]) => {
      this.cartItems = items;
      this.totalPrice = this.cartService.getTotalPrice();
      
    });
  }

  removeItem(productId:number): void {
    const item = this.cartItems.find(ci => ci.product.idProduit === productId);
    if (item) {
      this.cartService.removeFromCart(item.product);
      
    }
  }

  clearCart(): void {
    this.cartService.clearCart();
  }


  submitOrder(): void {

    const orderForm = {
      productOrders: this.cartItems.map(item => ({
        product: { idProduit: item.product.idProduit! },
        quantity: item.quantity
      }))
    };

    this.orderService.createOrder(orderForm).subscribe({
      next: (response) => {
        console.log('Order submitted successfully', response);
        this.cartService.clearCart();
      },
      error: (error) => {
        console.error('Error submitting order', error);
      }
    });}
}
