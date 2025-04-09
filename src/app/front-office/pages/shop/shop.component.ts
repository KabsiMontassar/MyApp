import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/Models/Product.Model';
import { CommonService } from 'src/app/services/common.service';
import { CartService } from 'src/app/services/cart.service';


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

  constructor(private commonService: CommonService, private cartService: CartService ) { }

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
 
  addToCart(product: Product): void {
    this.cartService.addToCart(product, 1);
    console.log(product.nom);
  }
}
