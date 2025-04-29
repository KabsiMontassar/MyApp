import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Product } from 'src/app/Models/Product.Model';
import { CommonService } from 'src/app/services/common.service';
import { CartService } from 'src/app/services/cart.service';
import { WishlistService } from 'src/app/services/wishlist.service';
import { ImageStorageService } from 'src/app/services/image-storage.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    RouterLink,
    NgxPaginationModule,
    NgbModule,
    DecimalPipe
  ]
})
export class ShopComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: any[] = [];
  page: number = 1;
  itemsPerPage: number = 3;
  selectedCategory: string = 'all';
  minPrice: number = 0;
  maxPrice: number = 1000;
  maxPriceLimit: number = 1000;
  @ViewChild('cartModal') cartModal!: TemplateRef<any>;
  @ViewChild('adviceModal') adviceModal!: TemplateRef<any>; // Reference to the advice modal
  cartCount: number = 0;
  adviceMessage: string = ''; // Variable to store the raw advice message
  formattedAdviceMessage: string = ''; // Variable to store the formatted advice message
  adviceProduct: Product = {} as Product; // Variable to store the selected product for the advice modal

  constructor(
    private commonService: CommonService, 
    private wishlistService: WishlistService,
    private imageStorage: ImageStorageService,
    private cartService: CartService,
    private modalService: NgbModal
  ) {
    this.cartService.numberOfProducts$.subscribe(count => {
      this.cartCount = count;
    });
  }

  ngOnInit() {
    console.log('Shop component initialization...');
    this.loadCategories();
    this.initializePriceRange();
    this.loadProducts();
  }

  loadProducts() {
    console.log('Loading products for shop component...');
    this.commonService.getProducts().subscribe(data => {
      this.products = data;
      this.filteredProducts = [...this.products];
      console.log(`Loaded ${this.products.length} products`);
      
      // Précharger les images pour tous les produits
      this.preloadProductImages();
    });
  }
  
  // Précharger les images de tous les produits pour assurer leur disponibilité
  private preloadProductImages(): void {
    console.log('Préchargement des images de produits dans le front-office...');
    
    // Parcourir tous les produits
    this.products.forEach(product => {
      if (product.imageURL) {
        // Récupérer l'URL de l'image
        const imageUrl = this.getImageUrl(product.imageURL);
        
        // Forcer le chargement de l'image en mémoire
        if (imageUrl && !imageUrl.startsWith('assets/')) {
          const img = new Image();
          img.src = imageUrl;
          console.log(`Front-office: Préchargement de l'image ${product.imageURL}`);
        }
      }
    });
  }

  openAdviceModal(product: Product) {
    this.adviceProduct = product; // Store the selected product for advice modal
    this.adviceMessage = product.conseilsCulture || 'Aucun conseil de culture disponible pour ce produit.'; 
    this.formattedAdviceMessage = this.formatAdviceText(this.adviceMessage); // Format the advice message
    
    // Ouvrir le modal SANS backdrop pour éviter les problèmes d'interface floue
    const modalRef = this.modalService.open(this.adviceModal, { 
      centered: true,
      backdrop: false,    // Pas de backdrop pour éviter de griser l'interface
      keyboard: true,     // Permet de fermer avec la touche ESC
      windowClass: 'conseil-culture-modal-window conseil-culture-modal-no-backdrop',
      size: 'md'          // Taille moyenne pour ne pas prendre tout l'écran
    });
    
    // Ajouter un gestionnaire d'événements pour s'assurer que le modal peut être fermé
    modalRef.result.catch(() => {
      // Gestion des erreurs de fermeture si nécessaire
      console.log('Modal fermé ou rejeté');
    });
  }
  showModal = false;
  selectedProduct!: Product;
  selectedQuantity = 1;
  selectedTotal = 0;
  openModal(content: any, product: Product) {
    this.selectedProduct = product;
    this.selectedQuantity = 1;
    this.selectedTotal = product.prix * this.selectedQuantity;
    this.modalService.open(content, { 
        centered: true,
        backdrop:false,
         // Empêche la fermeture en cliquant à l'extérieur
        keyboard: false // Empêche la fermeture avec ESC
    
    });
  }
  addToCart(product: Product): void {
    this.cartService.addToCart(product, 1);
    this.openModal(this.cartModal, product);
  }

  loadCategories() {
    this.commonService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  toggleWishlist(productId: number): void {
    if (this.wishlistService.isInWishlist(productId)) {
      this.wishlistService.removeFromWishlist(productId);
    } else {
      this.wishlistService.addToWishlist(productId);
    }
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistService.isInWishlist(productId);
  }

  getImageUrl(fileName: string): string {
    if (!fileName) {
      console.warn('Nom de fichier manquant dans shop.component');
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
      console.warn(`Image non trouvée dans le service: ${fileName}`);
      
      // DERNIER RECOURS: Chercher dans les assets/images
      if (!fileName.includes('/')) {
        // C'est peut-être un nom simple, essayer dans assets/images
        console.log(`Tentative avec assets/images/${fileName}`);
        return `assets/images/${fileName}`;
      } else {
        return fileName; // Fallback final
      }
    } else {
      console.log(`Image trouvée pour ${fileName}`);
      return imageUrl;
    }
  }

  sortByCategory(event: any) {
    const categoryId = event.target.value;
    if (categoryId === 'all') {
      this.filteredProducts = [...this.products];
    } else {
      this.filteredProducts = this.products.filter(product => 
        product.categorie?.idCategorie === Number(categoryId)
      );
    }
    this.page = 1; // Reset pagination when filtering
  }

  initializePriceRange() {
    this.commonService.getProducts().subscribe(products => {
      if (products.length > 0) {
        this.maxPriceLimit = Math.max(...products.map(p => p.prix || 0));
        this.maxPrice = this.maxPriceLimit;
      }
    });
  }

  filterByPrice() {
    this.filteredProducts = this.products.filter(product => 
      product.prix >= this.minPrice && product.prix <= this.maxPrice
    );
    this.page = 1; // Reset pagination when filtering
  }
   // Méthode pour améliorer le formatage du texte des conseils
   private formatAdviceText(text: string): string {
    // Si le texte est court, on le retourne tel quel
    if (text.length < 100) return text;
    
    // Sinon, on peut ajouter des formatages, par exemple:
    // - Ajouter des emojis
    // - Diviser en paragraphes
    // - Mettre en évidence certains mots clés
    
    let formattedText = text;
    
    // Exemples de formatage (à adapter selon vos besoins)
    const keywords = ['arrosage', 'soleil', 'fertilisation', 'taille'];
    
    keywords.forEach(keyword => {
      if (text.toLowerCase().includes(keyword)) {
        formattedText = formattedText.replace(
          new RegExp(`(${keyword})`, 'gi'), 
          match => `<strong class="text-success">${match}</strong>`
        );
      }
    });
    
    return formattedText;
  }
  
  // ... autres méthodes existantes

}
