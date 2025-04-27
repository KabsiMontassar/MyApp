import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { WishlistService } from 'src/app/services/wishlist.service';
import { Product } from 'src/app/Models/Product.Model';
import { ImageStorageService } from 'src/app/services/image-storage.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class WishlistComponent implements OnInit {
  products: Product[] = [];
  wishlistProducts: Product[] = [];

  constructor(
    private commonService: CommonService,
    private wishlistService: WishlistService,
    private imageStorage: ImageStorageService
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.commonService.getProducts().subscribe(products => {
      this.products = products;
      this.updateWishlistProducts();
    });
  }

  updateWishlistProducts() {
    const wishlistIds = this.wishlistService.getWishlist();
    this.wishlistProducts = this.products.filter(product => 
      wishlistIds.includes(product.idProduit || -1)
    );
  }

  removeFromWishlist(productId: number) {
    this.wishlistService.removeFromWishlist(productId);
    this.updateWishlistProducts();
  }

  getImageUrl(fileName: string): string {
    return this.imageStorage.getImageUrl(fileName) || fileName;
  }
}
