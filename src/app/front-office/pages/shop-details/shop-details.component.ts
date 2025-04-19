import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/Models/Product.Model';
import { AvisProduit } from 'src/app/Models/AvisProduit.Model';
import { CommonService } from 'src/app/services/common.service';
import { ImageStorageService } from 'src/app/services/image-storage.service';

@Component({
  selector: 'app-shop-details',
  templateUrl: './shop-details.component.html',
  styleUrls: ['./shop-details.component.css']
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
    this.commonService.getProductById(id).subscribe(
      (data: Product) => {
        this.selectedProduct = data;
        // Mettre à jour le statut
        if (this.selectedProduct.quantiteDisponible > 1) {
          this.selectedProduct.status = 'Disponible';
        } else if (this.selectedProduct.quantiteDisponible === 1) {
          this.selectedProduct.status = 'Dernier produit!';
        } else {
          this.selectedProduct.status = 'Hors stock';
        }
        // Charger les produits similaires
        this.loadSimilarProducts(this.selectedProduct);
      },
      (error) => {
        console.error('Erreur lors de la récupération du produit', error);
      }
    );
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
    return this.imageStorage.getImageUrl(fileName) || fileName;
  }
}
