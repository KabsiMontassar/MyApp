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
  filteredProducts: Product[] = [];
  categories: any[] = [];
  page: number = 1;
  itemsPerPage: number = 3;
  selectedCategory: string = 'all';
  minPrice: number = 0;
  maxPrice: number = 1000;
  maxPriceLimit: number = 1000;

  constructor(
    private commonService: CommonService, 
    private wishlistService: WishlistService,
    private imageStorage: ImageStorageService
  ) { }

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
    this.initializePriceRange();
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
      this.filteredProducts = [...this.products]; // Initialize filtered products
    });
  }

  loadCategories() {
    this.commonService.getCategories().subscribe({
      next: (data) => {
        console.log('Categories loaded:', data); // Pour déboguer
        this.categories = data;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
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

  sortByCategory(event: any) {
    const categoryId = event.target.value;
    if (categoryId === 'all') {
      this.filteredProducts = [...this.products];
    } else {
      this.filteredProducts = this.products.filter(product => 
        product.categorie?.idCategorie === Number(categoryId)
      );
    }
    this.page = 1; // Reset pagination when filtering
  }

  initializePriceRange() {
    this.commonService.getProducts().subscribe(products => {
      if (products.length > 0) {
        this.maxPriceLimit = Math.max(...products.map(p => p.prix || 0));
        this.maxPrice = this.maxPriceLimit;
      }
    });
  }

  filterByPrice() {
    this.filteredProducts = this.products.filter(product => 
      product.prix >= this.minPrice && product.prix <= this.maxPrice
    );
    this.page = 1; // Reset pagination when filtering
  }
}
