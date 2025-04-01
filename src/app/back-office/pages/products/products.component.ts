import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { Product } from 'src/app/Models/Product.Model';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  newProduct: Product = new Product();
  selectedProduct: Product = new Product();

  constructor(private commonService: CommonService) { }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.commonService.getProducts().subscribe(data => {
      this.products = data;
    });
  }

  addProduct() {
    this.commonService.addProduct(this.newProduct).subscribe(() => {
      this.loadProducts();
      this.newProduct = new Product();
    });
  }

  updateProduct() {
    this.commonService.updateProduct(this.selectedProduct).subscribe(() => {
      this.loadProducts();
      this.selectedProduct = new Product();
    });
  }

  deleteProduct(id: number) {
    this.commonService.deleteProduct(id).subscribe(() => {
      this.loadProducts();
    });
  }

  selectProduct(product: Product) {
    this.selectedProduct = { ...product };
  }
}