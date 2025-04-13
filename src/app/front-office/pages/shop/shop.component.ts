import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Product } from 'src/app/Models/Product.Model';
import { CommonService } from 'src/app/services/common.service';
import { CartService } from 'src/app/services/cart.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


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

  constructor(private commonService: CommonService, private cartService: CartService,private modalService: NgbModal ) {
    this.cartService.numberOfProducts$.subscribe(count => {
      this.cartCount = count;
    });
    
   }

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();

  }

  loadProducts() {
    this.commonService.getProducts().subscribe(data => {
      this.products = data;
    });
  }
  loadCategories() {
    this.commonService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

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
}
