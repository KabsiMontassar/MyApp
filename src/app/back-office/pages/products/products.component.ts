import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  Products: any[] = [];

  constructor(private cs: CommonService) {}

  ngOnInit() {
    this.cs.getProducts().subscribe({
      next: (data) => {
        this.Products = data;
        console.log('Utilisateurs récupérés :', this.Products);
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des utilisateurs', error);
      }
    });
  }
}