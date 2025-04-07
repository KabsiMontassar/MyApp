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

  selectedProduct!: Product;
  newAvis: AvisProduit = {
    comment: '',
    dateAvis: ''}

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
    this.newAvis = {
      comment: '',
      dateAvis: new Date().toISOString().slice(0, 10),
      produit: {
        idProduit: this.selectedProduct.idProduit!,
        nom: this.selectedProduct.nom
      }
    };
    
  }
  
  loadProductById(id: number) {
    this.commonService.getProductById(id).subscribe(data => {
      this.selectedProduct = data;
    }, error => {
      console.error("Erreur de chargement :", error);
    });
  }
  addAvis() {
    this.newAvis.dateAvis = new Date().toISOString().split('T')[0]; // format YYYY-MM-DD
    this.newAvis.produit = {
      idProduit: this.selectedProduct.idProduit!,
      nom: this.selectedProduct.nom
    };
  
    this.commonService.addAvis(this.newAvis).subscribe(() => {
      console.log("Avis ajouté avec succès !");
      this.newAvis = { comment: '', dateAvis: '' }; // Réinitialiser le formulaire
  
      // Rafraîchir la fiche produit pour recharger les avis
      this.loadProductById(this.selectedProduct.idProduit!);
    }, error => {
      console.error("Erreur lors de l'ajout de l'avis :", error);
    });
  }
  }
