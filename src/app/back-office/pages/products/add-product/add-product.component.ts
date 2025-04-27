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
    conseilsCulture: '',
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
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewImageURL = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  addProduct() {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64String = e.target.result.split(',')[1];
        const fileName = `product_${Date.now()}_${this.selectedFile!.name}`;
        this.newProduct.imageURL = fileName;

        // Stocker l'image d'abord
        this.imageStorage.storeImage(fileName, base64String);

        // Puis ajouter le produit
        this.submitProduct();
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      this.submitProduct();
    }
  }

  private submitProduct() {
    // Assurons-nous que conseilsCulture est bien défini
    if (!this.newProduct.conseilsCulture) {
      this.newProduct.conseilsCulture = '';
    }
    console.log('Produit à ajouter:', this.newProduct);
    this.commonService.addProduct(this.newProduct).subscribe({
      next: (response) => {
        console.log('Produit ajouté avec succès:', response);
        this.router.navigate(['/backoffice/products']);
      },
      error: (error) => {
        console.error('Erreur lors de l\'ajout du produit:', error);
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