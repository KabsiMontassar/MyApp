import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { Router } from '@angular/router';
import { Product } from 'src/app/Models/Product.Model';
import { ImageStorageService } from 'src/app/services/image-storage.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  stocks: any[] = [];  
  categories: any[] = [];  
  selectedFile: File | null = null;
  previewImageURL: string | null = null;

  newProduct: any = {
    nom: '',
    description: '',
    prix: null,
    quantiteDisponible: null,
    dateAjout: null,
    imageURL: '',
    stock: null,      // objet Stock
    categorie: null   // objet Categorie
  };

  constructor(
    private commonService: CommonService,
    private router: Router,
    private imageStorage: ImageStorageService
  ) {}

  ngOnInit(): void {
    this.commonService.getStocks().subscribe(data => {
      this.stocks = data;
    });
  
    this.commonService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }
  

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64String = e.target.result.split(',')[1];
        const fileName = `product_${Date.now()}_${file.name}`;
        this.newProduct.imageURL = this.imageStorage.storeImage(fileName, base64String);
        this.previewImageURL = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  addProduct() {
    // S'assurer que tous les champs nécessaires sont présents
    this.newProduct = {
      ...this.newProduct,
      // Ajouter des valeurs par défaut si nécessaire
      dateAjout: this.newProduct.dateAjout || new Date().toISOString().split('T')[0],
      status: this.newProduct.quantiteDisponible > 0 ? 'Disponible' : 'Hors stock',
      // Extraire les IDs nécessaires
      idStock: this.newProduct.stock?.idStock,
      idCategorie: this.newProduct.categorie?.idCategorie
    };

    // Log pour déboguer
    console.log('Produit à ajouter:', this.newProduct);

    this.commonService.addProduct(this.newProduct).subscribe({
      next: (response) => {
        console.log('Produit ajouté avec succès:', response);
        this.router.navigate(['/backoffice/products']);
      },
      error: (error) => {
        console.error('Erreur lors de l\'ajout du produit:', error);
        // Afficher l'erreur complète pour le débogage
        console.error('Détails de l\'erreur:', error.error);
      }
    });
  }

  onQuantiteChange() {
    if (this.newProduct.quantiteDisponible > 1) {
      this.newProduct.status = 'En stock';
    } else if (this.newProduct.quantiteDisponible === 1) {
      this.newProduct.status = 'Dernier produit!';
    } else {
      this.newProduct.status = 'Hors stock';
    }
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