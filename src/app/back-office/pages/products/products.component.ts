import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { Product } from 'src/app/Models/Product.Model';
import { ImageStorageService } from 'src/app/services/image-storage.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchTerm: string = '';
  page: number = 1;
  itemsPerPage: number = 3;  // Définir 3 produits par page

  constructor(
    private commonService: CommonService,
    private imageStorage: ImageStorageService
  ) { }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.commonService.getProducts().subscribe(data => {
      this.products = data.map(product => {
        if (product.quantiteDisponible > 1) {
          product.status = 'Disponible';
        } else if (product.quantiteDisponible === 1) {
          product.status = 'Dernier produit!';
        } else {
          product.status = 'Hors stock';
        }
        return product;
      });
      this.filteredProducts = this.products;
    });
  }

  searchProducts() {
    this.filteredProducts = this.products.filter(product => 
      product.nom.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.page = 1;
  }

  deleteProduct(id: number) {
    this.commonService.deleteProduct(id).subscribe(() => {
      this.loadProducts();
    });
  }

  getImageUrl(fileName: string): string {
    return this.imageStorage.getImageUrl(fileName) || fileName;
  }

  onPageChange(page: number) {
    this.page = page;
  }
}