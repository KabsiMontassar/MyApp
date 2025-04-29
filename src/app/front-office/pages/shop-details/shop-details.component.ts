import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { Product } from 'src/app/Models/Product.Model';
import { AvisProduit } from 'src/app/Models/AvisProduit.Model';
import { CommonService } from 'src/app/services/common.service';
import { ImageStorageService } from 'src/app/services/image-storage.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgriculturalMapComponent } from '../agricultural-map/agricultural-map.component';

@Component({
  selector: 'app-shop-details',
  templateUrl: './shop-details.component.html',
  styleUrls: ['./shop-details.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    AgriculturalMapComponent
  ]
})

export class ShopDetailsComponent {
  selectedProduct!: Product;
  similarProducts: Product[] = [];
  newAvis: AvisProduit = {
    comment: '',
    dateAvis: '',
    produit: { idProduit: 0 }
  };

  constructor(
    private route: ActivatedRoute, 
    private commonService: CommonService,
    private imageStorage: ImageStorageService
  ) {
    // Souscrire aux changements de route
    this.route.params.subscribe(params => {
      const productId = Number(params['id']);
      if (productId) {
        this.getProductById(productId);
        this.newAvis.produit = { idProduit: productId };
      }
    });
  }

  getProductById(id: number): void {
    console.log(`Chargement du produit ${id} dans shop-details...`);
    this.commonService.getProductById(id).subscribe(
      (data: Product) => {
        this.selectedProduct = data;
        console.log(`Produit récupéré:`, this.selectedProduct);
        
        // Mettre à jour le statut
        if (this.selectedProduct.quantiteDisponible > 1) {
          this.selectedProduct.status = 'Disponible';
        } else if (this.selectedProduct.quantiteDisponible === 1) {
          this.selectedProduct.status = 'Dernier produit!';
        } else {
          this.selectedProduct.status = 'Hors stock';
        }
        
        // Précharger l'image du produit principal
        this.preloadProductImage(this.selectedProduct);
        
        // Charger les produits similaires
        this.loadSimilarProducts(this.selectedProduct);
      },
      (error) => {
        console.error('Erreur lors de la récupération du produit', error);
      }
    );
  }
  
  // Précharger l'image d'un produit
  private preloadProductImage(product: Product): void {
    if (product.imageURL) {
      console.log(`Préchargement de l'image pour ${product.nom}`);
      const imageUrl = this.getImageUrl(product.imageURL);
      
      // Forcer le chargement de l'image en mémoire
      if (imageUrl && imageUrl.startsWith('data:')) {
        const img = new Image();
        img.src = imageUrl;
        img.onload = () => {
          console.log(`Image préchargée avec succès: ${product.imageURL}`);
        };
        img.onerror = () => {
          console.error(`Échec de préchargement de l'image: ${product.imageURL}`);
        };
      } else {
        console.warn(`Image non trouvée dans le cache: ${product.imageURL}`);
      }
    }
  }

  loadSimilarProducts(selectedProduct: Product): void {
    console.log('Loading similar products for:', selectedProduct);
    
    // Vérifier si la catégorie existe dans l'objet categorie
    if (!selectedProduct || !selectedProduct.categorie || !selectedProduct.categorie.idCategorie) {
        console.log('Produit ou catégorie non défini');
        return;
    }

    const categoryId = selectedProduct.categorie.idCategorie;
    console.log('Catégorie ID:', categoryId);

    this.commonService.getProducts().subscribe({
        next: (products: Product[]) => {
            this.similarProducts = products.filter(product => 
                product.categorie && // Vérifier que la catégorie existe
                product.categorie.idCategorie === categoryId && // Comparer les IDs de catégorie
                product.idProduit !== selectedProduct.idProduit // Exclure le produit actuel
            );

            console.log(`Produits trouvés pour la catégorie ${categoryId}:`, this.similarProducts);
        },
        error: (error) => {
            console.error('Erreur lors du chargement des produits similaires:', error);
        }
    });
  }

  addAvis(): void {
    this.newAvis.dateAvis = new Date().toISOString(); // Date du jour

    this.commonService.addAvis(this.newAvis).subscribe(
      (response) => {
        console.log('Avis ajouté avec succès', response);
        // Recharger les avis après ajout
        this.getProductById(this.newAvis.produit!.idProduit);
        // Réinitialiser le formulaire
        this.newAvis.comment = '';
      },
      (error) => {
        console.error('Erreur lors de l’ajout de l’avis', error);
      }
    );
  }

  getImageUrl(fileName: string): string {
    if (!fileName) {
      console.warn('Nom de fichier manquant dans shop-details.component');
      return 'assets/images/product-1.jpg';
    }
    
    // D'abord vérifier si c'est une URL complète
    if (fileName.startsWith('http') || fileName.startsWith('data:')) {
      return fileName;
    }
    
    // Récupérer via le service
    const imageUrl = this.imageStorage.getImageUrl(fileName);
    
    // Log détaillé pour débogage
    if (!imageUrl || imageUrl === fileName) {
      console.warn(`Image non trouvée dans le service: ${fileName}, utilisation du nom comme fallback`);
    } else {
      console.log(`Image trouvée pour ${fileName} (${imageUrl.substring(0, 20)}...)`);
    }
    
    return imageUrl || fileName;
  }
}
