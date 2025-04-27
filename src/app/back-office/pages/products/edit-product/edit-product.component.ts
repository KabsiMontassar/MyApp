import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { Product } from 'src/app/Models/Product.Model';
import { ImageStorageService } from 'src/app/services/image-storage.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  product: any = {};  // ou new Product(), si le modèle est bien défini
  stocks: any[] = [];
  categories: any[] = [];
  selectedFile: File | null = null;
  previewImageURL: string | null = null;

  constructor(
    private commonService: CommonService,
    private route: ActivatedRoute,
    private router: Router,
    private imageStorage: ImageStorageService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.commonService.getProductById(+id).subscribe((data) => {
        this.product = data;
        // Utiliser le service pour récupérer l'image
        this.previewImageURL = this.imageStorage.getImageUrl(this.product.imageURL) || this.product.imageURL;
        this.updateStatus();
      });
    }

    // Charger les listes de sélection
    this.commonService.getStocks().subscribe(data => {
      this.stocks = data;
    });

    this.commonService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  updateStatus() {
    if (this.product.quantiteDisponible > 1) {
      this.product.status = 'En stock';
    } else if (this.product.quantiteDisponible === 1) {
      this.product.status = 'Dernier produit!';
    } else {
      this.product.status = 'Hors stock';
    }
  }

  onQuantiteChange() {
    this.updateStatus();
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

  updateProduct() {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64String = e.target.result.split(',')[1];
        const fileName = `product_${Date.now()}_${this.selectedFile!.name}`;
        
        // Stocker la nouvelle image
        this.imageStorage.storeImage(fileName, base64String);
        
        // Mettre à jour l'URL de l'image dans le produit
        this.product.imageURL = fileName;
        
        // Puis mettre à jour le produit
        this.submitUpdate();
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      this.submitUpdate();
    }
  }

  private submitUpdate() {
    // Assurons-nous que conseilsCulture est bien défini
    if (!this.product.conseilsCulture) {
      this.product.conseilsCulture = '';
    }
    this.commonService.updateProduct(this.product).subscribe({
      next: (response) => {
        console.log('Produit mis à jour avec succès:', response);
        this.router.navigate(['/backoffice/products']);
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour:', error);
      }
    });
  }
}