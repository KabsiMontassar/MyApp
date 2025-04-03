import { Component } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { Router } from '@angular/router';
import { Product } from 'src/app/Models/Product.Model';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent {
  newProduct: Product = new Product();  // L'objet produit
  selectedFile: File | null = null;  // Variable pour stocker l'image sélectionnée

  constructor(private commonService: CommonService, private router: Router) {}

  // Méthode pour capturer l'image
  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];  // Récupère le fichier sélectionné
  }

  // Méthode pour ajouter un produit avec image
  addProduct() {
    if (this.selectedFile) {
      // On suppose que l'image est envoyée via un champ 'imageURL' de type string dans l'objet newProduct
      this.newProduct.imageURL = this.selectedFile.name;  // Nous enregistrons juste le nom de l'image, ou tu peux gérer le chemin complet
    }

    // Appel au service pour ajouter le produit avec les données de l'image
    this.commonService.addProduct(this.newProduct).subscribe(() => {
      this.router.navigate(['/backoffice/products']);
    });
  }
}
