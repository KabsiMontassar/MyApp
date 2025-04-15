import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../Models/Product.Model';

export interface CartItem {
  product: Product;
  quantity: number;
  isUnavailable?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  // BehaviorSubject helps notify components when the cart changes.
  private cartSubject: BehaviorSubject<CartItem[]> = new BehaviorSubject<CartItem[]>([]);
  private numberOfProductsSubject = new BehaviorSubject<number>(0);
  numberOfProducts$ = this.numberOfProductsSubject.asObservable();


  constructor() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
      this.cartSubject.next(this.cartItems);
    }
    this.updateNumberOfProducts();
  }
  
  private saveCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  private discardCart(): void {
    this.cartItems = [];
    localStorage.removeItem('cart');
  }
  
  
  // Observable for other components to subscribe to cart updates.
  getCart(): Observable<CartItem[]> {
    return this.cartSubject.asObservable();
  }

  // Get current cart items (useful for synchronous access)
  getCartItems(): CartItem[] {
    return this.cartItems;
  }

 
  addToCart(product: Product, quantity: number = 1): void {
    // Check if product already exists in the cart
    const itemIndex = this.cartItems.findIndex(item => item.product.idProduit === product.idProduit);
    if (itemIndex > -1) {
      // Increase quantity if found
      this.cartItems[itemIndex].quantity += quantity;
    } else {
      // Else, add new item
      this.cartItems.push({ product, quantity });
    }
    // Notify subscribers
    this.cartSubject.next(this.cartItems);
    this.updateNumberOfProducts();
    this.saveCart();
  }


  removeFromCart(product: Product): void {
    this.cartItems = this.cartItems.filter(item => item.product.idProduit !== product.idProduit);
    this.cartSubject.next(this.cartItems);
    this.updateNumberOfProducts();

    this.saveCart(); // juste après cartSubject.next(...)
  }


  clearCart(): void {
    this.cartItems = [];
    this.cartSubject.next(this.cartItems);
    this.updateNumberOfProducts();
    this.saveCart();
  }

  // Get total price of items in the cart
  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + (item.product.prix * item.quantity), 0);
  }

  private updateNumberOfProducts(): void {
    this.numberOfProductsSubject.next(this.cartItems.length);
  }
  
  
}
