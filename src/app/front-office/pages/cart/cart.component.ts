import { Component, OnInit } from '@angular/core';
import { CartItem, CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalPrice: number = 0;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.cartService.getCart().subscribe((items: CartItem[]) => {
      this.cartItems = items;
      this.totalPrice = this.cartService.getTotalPrice();
    });
  }

  removeItem(productId: number): void {
    const item = this.cartItems.find(ci => ci.product.idProduit === productId);
    if (item) {
      this.cartService.removeFromCart(item.product);
    }
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  // Proceed to submit the order to your backend
  submitOrder(): void {
    // Here you would call your Order API
    // Prepare the OrderForm that the backend expects
    // For example:
    const orderForm = {
      productOrders: this.cartItems.map(item => ({
        product: { idProduit: item.product.idProduit },
        quantity: item.quantity
      }))
    };

    // Call your order service to submit the order
    // this.orderService.createOrder(orderForm).subscribe(...);
  }
}
