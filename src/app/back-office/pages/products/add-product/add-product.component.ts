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
        // Obtenir l'URL complète des données (data URL)
        const fullDataUrl = e.target.result;
        console.log('📸 Image lue, data URL complète disponible');
        
        try {
          // Générer un nom de fichier unique
          const originalName = this.selectedFile!.name.substring(0, 30);
          const timestamp = Date.now();
          const fileName = `product_${timestamp}_${originalName}`;
          
          console.log(`📝 Nom de fichier généré: ${fileName}`);
          
          // CHANGEMENT IMPORTANT: Stocker la data URL complète avec son préfixe
          // Note: On stock le nom de fichier dans le produit
          this.newProduct.imageURL = fileName;
          
          // Extraire la partie base64 pour le stockage traditionnel
          const base64String = fullDataUrl.split(',')[1];
          if (!base64String) {
            console.error('❌ Erreur lors de l\'extraction du base64');
            alert('Erreur lors du traitement de l\'image. Veuillez réessayer avec une autre image.');
            return;
          }
          
          const mimeType = fullDataUrl.split(',')[0].split(':')[1].split(';')[0];
          console.log(`Type MIME détecté: ${mimeType}`);
          
          // Utiliser la nouvelle méthode de stockage qui conserve également le type MIME
          console.log(`💾 Stockage de l'image ${fileName} (type: ${mimeType}) dans le service`);
          
          // 1. Stocker AVEC le préfixe data: dans localStorage pour assurer la compatibilité
          localStorage.setItem(`direct_image_${fileName}`, fullDataUrl);
          
          // 2. Utiliser aussi la méthode existante 
          this.imageStorage.storeImage(fileName, base64String);
          
          // Forcer le stockage dans window pour assurer la disponibilité entre navigations
          // @ts-ignore
          if (!window.appImageCache) {
            // @ts-ignore
            window.appImageCache = {};
          }
          // @ts-ignore
          window.appImageCache[fileName] = fullDataUrl;
          
          // Clear caches to avoid stale images
          localStorage.removeItem('direct_image_' + fileName);
          sessionStorage.clear();
          this.imageStorage.clearCaches();
          // @ts-ignore
          window.appImageCache = {};
          
          // Re-store the image after clearing caches
          localStorage.setItem(`direct_image_${fileName}`, fullDataUrl);
          this.imageStorage.storeImage(fileName, base64String);
          // @ts-ignore
          window.appImageCache[fileName] = fullDataUrl;
          
          // Test critique: Vérifier si l'image peut être récupérée avant de continuer
          console.log('🔍 Vérification de l\'image après stockage...');
          
          // Forcer l'attente pour assurer que le stockage est terminé
          setTimeout(() => {
            const retrievedUrl = this.imageStorage.getImageUrl(fileName);
            
            if (retrievedUrl && retrievedUrl.startsWith('data:')) {
              console.log('✅ Image correctement stockée et récupérable');
              
              // Précharger l'image pour s'assurer qu'elle est dans le cache navigateur
              const img = new Image();
              img.src = retrievedUrl;
              
              // Puis ajouter le produit
              this.submitProduct();
            } else {
              console.error('❌ L\'image n\'a pas pu être récupérée après stockage');
              alert('Problème avec le stockage de l\'image. Les données pourraient ne pas persister.');
              // On continue quand même, mais avec un avertissement
              this.submitProduct();
            }
          }, 100); // Petit délai pour s'assurer que le stockage est terminé
        } catch (error) {
          console.error('❌ Erreur lors du traitement de l\'image:', error);
          // En cas d'erreur, on continue quand même sans image
          this.submitProduct();
        }
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
