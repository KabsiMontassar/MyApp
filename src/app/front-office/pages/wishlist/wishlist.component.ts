import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { WishlistService } from 'src/app/services/wishlist.service';
import { Product } from 'src/app/Models/Product.Model';
import { ImageStorageService } from 'src/app/services/image-storage.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class WishlistComponent implements OnInit {
  products: Product[] = [];
  wishlistProducts: Product[] = [];

  constructor(
    private commonService: CommonService,
    private wishlistService: WishlistService,
    private imageStorage: ImageStorageService
  ) {}

  ngOnInit() {
    console.log('Wishlist component initialization...');
    this.loadProducts();
  }

  loadProducts() {
    console.log('Loading products for wishlist...');
    this.commonService.getProducts().subscribe(products => {
      this.products = products;
      console.log(`Loaded ${this.products.length} products for wishlist filtering`);
      this.updateWishlistProducts();
    });
  }

  updateWishlistProducts() {
    const wishlistIds = this.wishlistService.getWishlist();
    console.log('Current wishlist IDs:', wishlistIds);
    
    this.wishlistProducts = this.products.filter(product => 
      wishlistIds.includes(product.idProduit || -1)
    );
    
    console.log(`Found ${this.wishlistProducts.length} products in wishlist`);
    
    // Précharger les images des produits en wishlist
    this.preloadWishlistImages();
  }
  
  // Précharger les images des produits en wishlist
  private preloadWishlistImages() {
    console.log('Préchargement des images de wishlist...');
    
    if (this.wishlistProducts.length > 0) {
      this.wishlistProducts.forEach(product => {
        if (product.imageURL) {
          // Récupérer l'URL et forcer le chargement
          const imageUrl = this.getImageUrl(product.imageURL);
          
          // Créer une Image pour précharger
          if (imageUrl && !imageUrl.startsWith('assets/')) {
            const img = new Image();
            img.src = imageUrl;
            console.log(`Wishlist: préchargement de l'image pour ${product.nom}`);
          }
        }
      });
    }
  }

  removeFromWishlist(productId: number) {
    console.log(`Removing product ${productId} from wishlist`);
    this.wishlistService.removeFromWishlist(productId);
    this.updateWishlistProducts();
  }

  getImageUrl(fileName: string): string {
    if (!fileName) {
      console.warn('Nom de fichier manquant dans wishlist.component');
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
