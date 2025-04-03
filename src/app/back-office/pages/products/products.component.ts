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

  constructor(private commonService: CommonService) { }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.commonService.getProducts().subscribe(data => {
      this.products = data;
    });
  }

  deleteProduct(id: number) {
    this.commonService.deleteProduct(id).subscribe(() => {
      this.loadProducts();
    });
  }
}
