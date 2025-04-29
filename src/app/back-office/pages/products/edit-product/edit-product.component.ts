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
        // Obtenir l'URL complète des données (data URL)
        const fullDataUrl = e.target.result;
        console.log('📸 Image lue, data URL complète disponible');
        
        try {
          // Générer un nom de fichier unique
          const originalName = this.selectedFile!.name.substring(0, 30);
          const timestamp = Date.now();
          const fileName = `product_${timestamp}_${originalName}`;
          
          console.log(`📝 Nom de fichier généré: ${fileName}`);
          
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
              
              // Mettre à jour l'URL de l'image dans le produit
              this.product.imageURL = fileName;
              
              // Puis mettre à jour le produit
              this.submitUpdate();
            } else {
              console.error('❌ L\'image n\'a pas pu être récupérée après stockage');
              alert('Problème avec le stockage de l\'image. Les données pourraient ne pas persister.');
              // On continue quand même, mais avec un avertissement
              this.product.imageURL = fileName;
              this.submitUpdate();
            }
          }, 100); // Petit délai pour s'assurer que le stockage est terminé
        } catch (error) {
          console.error('❌ Erreur lors du traitement de l\'image:', error);
          // En cas d'erreur, on continue quand même sans changer l'image
          this.submitUpdate();
        }
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
