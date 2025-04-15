import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/Models/Product.Model';
import { CommonService } from 'src/app/services/common.service';
import { WishlistService } from 'src/app/services/wishlist.service';
import { ImageStorageService } from 'src/app/services/image-storage.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
products: Product[] = [];
categories: any[] = [];
page: number = 1;
itemsPerPage: number = 3;

  constructor(
    private commonService: CommonService, 
    private wishlistService: WishlistService,
    private imageStorage: ImageStorageService
  ) { }

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();

  }

  loadProducts() {
    this.commonService.getProducts().subscribe(data => {
      this.products = data.map(product => {
        // Mettre à jour le statut en fonction de la quantité
        if (product.quantiteDisponible > 1) {
          product.status = 'Disponible';
        } else if (product.quantiteDisponible === 1) {
          product.status = 'Dernier produit!';
        } else {
          product.status = 'Hors stock';
        }
        return product;
      });
    });
  }
  loadCategories() {
    this.commonService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }
 

  toggleWishlist(productId: number): void {
    if (this.wishlistService.isInWishlist(productId)) {
      this.wishlistService.removeFromWishlist(productId);
    } else {
      this.wishlistService.addToWishlist(productId);
    }
  }
  
  isInWishlist(productId: number): boolean {
    return this.wishlistService.isInWishlist(productId);
  }

  getImageUrl(fileName: string): string {
    return this.imageStorage.getImageUrl(fileName) || fileName;
  }
  
}
