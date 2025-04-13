import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/Models/Product.Model';
import { AvisProduit } from 'src/app/Models/AvisProduit.Model';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-shop-details',
  templateUrl: './shop-details.component.html',
  styleUrls: ['./shop-details.component.css']
})
export class ShopDetailsComponent implements OnInit {
  newAvis: { comment: string } = { comment: '' };

  selectedProduct!: Product;
  
  constructor(
    private commonService: CommonService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? +idParam : null;
  
    if (id !== null) {
      this.loadProductById(id);
    } else {
      console.error('ID du produit non valide !');
    }
}
  
  loadProductById(id: number) {
    this.commonService.getProductById(id).subscribe(data => {
      this.selectedProduct = data;
  
    });
  }

  addAvis() {
    
}
}