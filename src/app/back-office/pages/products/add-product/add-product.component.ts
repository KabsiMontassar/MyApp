import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { Router } from '@angular/router';
import { Product } from 'src/app/Models/Product.Model';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  stocks: any[] = [];  
  categories: any[] = [];  
  selectedFile: File | null = null;

newProduct: any = {
  nom: '',
  description: '',
  prix: null,
  quantiteDisponible: null,
  dateAjout: null,
  imageURL: '',
  status: '',
  stock: null, 
  categorie: null 
};


  constructor(private commonService: CommonService, private router: Router) {}
  ngOnInit(): void {
    this.commonService.getStocks().subscribe(data => {
      this.stocks = data;
    });
  
    this.commonService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }
  

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];  
  }

  addProduct() {
    if (this.selectedFile) {
      this.newProduct.imageURL = this.selectedFile.name;
    }
    this.commonService.addProduct(this.newProduct).subscribe(() => {
      this.router.navigate(['/backoffice/products']);
    });
  }
  getStocks() {
    this.commonService.getStocks().subscribe(stocks => {
      this.stocks = stocks;
    });
  }

  getCategories() {
    this.commonService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }
}
