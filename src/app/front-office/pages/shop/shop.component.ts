import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Product } from 'src/app/Models/Product.Model';
import { CommonService } from 'src/app/services/common.service';
<<<<<<< HEAD
import { WishlistService } from 'src/app/services/wishlist.service';
import { ImageStorageService } from 'src/app/services/image-storage.service';
=======
import { CartService } from 'src/app/services/cart.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

>>>>>>> 4bbcdf37146ca42a7b63723e8103dabfa5d937d9

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {

products: Product[] = [];
categories: any[] = [];
page: number = 1;
@ViewChild('cartModal') cartModal!: TemplateRef<any>; 
itemsPerPage: number = 3;
cartCount: number = 0;

<<<<<<< HEAD
  constructor(
    private commonService: CommonService, 
    private wishlistService: WishlistService,
    private imageStorage: ImageStorageService
  ) { }
=======
  constructor(private commonService: CommonService, private cartService: CartService,private modalService: NgbModal ) {
    this.cartService.numberOfProducts$.subscribe(count => {
      this.cartCount = count;
    });
    
   }
>>>>>>> 4bbcdf37146ca42a7b63723e8103dabfa5d937d9

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
<<<<<<< HEAD
 

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
  
=======

  showModal = false;
  selectedProduct!: Product;
  selectedQuantity = 1;
  selectedTotal = 0;
  
  openModal(content: any, product: Product) {
    this.selectedProduct = product;
    this.selectedQuantity = 1;
    this.selectedTotal = product.prix * this.selectedQuantity;
    this.modalService.open(content, { 
        centered: true,
        backdrop: false, // Empêche la fermeture en cliquant à l'extérieur
        keyboard: false // Empêche la fermeture avec ESC
    
    });
}
  addToCart(product: Product): void {
    this.cartService.addToCart(product, 1);
    console.log(product.nom);
    this.openModal(this.cartModal, product);
  }
>>>>>>> 4bbcdf37146ca42a7b63723e8103dabfa5d937d9
}
