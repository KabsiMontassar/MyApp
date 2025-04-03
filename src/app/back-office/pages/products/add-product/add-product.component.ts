import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { Product } from 'src/app/Models/Product.Model';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent {
  newProduct: Product = new Product();

  constructor(private commonService: CommonService, private router: Router) {}

  addProduct() {
    this.commonService.addProduct(this.newProduct).subscribe(() => {
      this.router.navigate(['/products']);
    });
  }
}
