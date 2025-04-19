import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlist: number[] = []; // stocke les IDs des produits

  constructor() {
    const storedWishlist = localStorage.getItem('wishlist');
    if (storedWishlist) {
      this.wishlist = JSON.parse(storedWishlist);
    }
  }

  getWishlist(): number[] {
    return this.wishlist;
  }

  addToWishlist(productId: number): void {
    if (!this.wishlist.includes(productId)) {
      this.wishlist.push(productId);
      this.save();
    }
  }

  removeFromWishlist(productId: number): void {
    this.wishlist = this.wishlist.filter(id => id !== productId);
    this.save();
  }

  isInWishlist(productId: number): boolean {
    return this.wishlist.includes(productId);
  }

  private save() {
    localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
  }
}