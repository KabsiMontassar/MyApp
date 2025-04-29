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
  product: any = {};
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
      // Compresser l'image avant de la stocker
      this.compressAndProcessImage(this.selectedFile);
    } else {
      this.submitUpdate();
    }
  }

  private compressAndProcessImage(file: File) {
    // Créer un élément canvas pour redimensionner l'image
    const img = new Image();
    const reader = new FileReader();
    
    reader.onload = (event: any) => {
      img.onload = () => {
        // Dimensions maximales souhaitées
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 600;
        
        // Calculer les nouvelles dimensions tout en conservant le ratio
        let width = img.width;
        let height = img.height;
        
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
        
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
        
        // Créer un canvas avec les nouvelles dimensions
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        // Dessiner l'image redimensionnée
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convertir en JPEG avec compression (qualité 0.7 sur une échelle de 0 à 1)
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
          console.log('📸 Image compressée et redimensionnée');
          
          // Continuer avec le traitement de l'image
          this.processCompressedImage(compressedDataUrl, file.name);
        } else {
          console.error('❌ Impossible de créer le contexte canvas');
          this.submitUpdate(); // Continuer sans image
        }
      };
      
      img.src = event.target.result;
    };
    
    reader.readAsDataURL(file);
  }
  
  private processCompressedImage(compressedDataUrl: string, originalFilename: string) {
    try {
      // Générer un nom de fichier unique
      const originalName = originalFilename.substring(0, 30);
      const timestamp = Date.now();
      const fileName = `product_${timestamp}_${originalName}`;
      
      console.log(`📝 Nom de fichier généré: ${fileName}`);
      
      // Extraire la partie base64 pour le stockage traditionnel
      const parts = compressedDataUrl.split(',');
      const base64String = parts[1];
      
      if (!base64String) {
        console.error('❌ Erreur lors de l\'extraction du base64');
        alert('Erreur lors du traitement de l\'image. Veuillez réessayer avec une autre image.');
        return;
      }
      
      const mimeType = parts[0].split(':')[1].split(';')[0];
      console.log(`Type MIME détecté: ${mimeType}`);
      
      // Utiliser la nouvelle méthode de stockage qui conserve également le type MIME
      console.log(`💾 Stockage de l'image ${fileName} (type: ${mimeType}) dans le service`);
          
      // Tenter de stocker l'image, mais gérer les erreurs de quota
      try {
        // 1. Stocker AVEC le préfixe data: dans localStorage pour assurer la compatibilité
        localStorage.setItem(`direct_image_${fileName}`, compressedDataUrl);
      } catch (storageError) {
        console.warn('⚠️ Impossible de stocker l\'image dans localStorage (quota dépassé)');
        // Continuer sans stocker dans localStorage
      }
      
      try {
        // 2. Utiliser aussi la méthode existante 
        this.imageStorage.storeImage(fileName, base64String);
      } catch (storageError) {
        console.warn('⚠️ Impossible de stocker l\'image avec imageStorage');
        // Continuer sans stocker dans imageStorage
      }
      
      try {
        // Forcer le stockage dans window pour assurer la disponibilité entre navigations
        // @ts-ignore
        if (!window.appImageCache) {
          // @ts-ignore
          window.appImageCache = {};
        }
        // @ts-ignore
        window.appImageCache[fileName] = compressedDataUrl;
      } catch (storageError) {
        console.warn('⚠️ Impossible de stocker l\'image dans window.appImageCache');
        // Continuer sans stocker dans window.appImageCache
      }
      
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
  }

  private submitUpdate() {
    // Vérifier la disponibilité et ajuster le statut en conséquence
    const quantiteDisponible = Number(this.product.quantiteDisponible || 0);
    let status = 'Hors stock';
    if (quantiteDisponible > 1) {
      status = 'En stock';
    } else if (quantiteDisponible === 1) {
      status = 'Dernier produit!';
    }
    
    // Créer un objet Product conforme au modèle côté backend
    const product = new Product();
    product.idProduit = this.product.idProduit; // Essentiel pour la mise à jour
    product.nom = this.product.nom || '';
    product.description = this.product.description || '';
    product.prix = Number(this.product.prix || 0);
    product.quantiteDisponible = Number(this.product.quantiteDisponible || 0);
    product.dateAjout = this.product.dateAjout || new Date().toISOString();
    product.imageURL = this.product.imageURL || '';
    product.status = this.product.status || status;
    product.conseilsCulture = this.product.conseilsCulture || '';
    
    // Configurer les relations de manière explicite 
    if (this.product.stock) {
      if (typeof this.product.stock === 'object') {
        product.stock = this.product.stock;
        product.idStock = this.product.stock.idStock;
      } else {
        product.idStock = Number(this.product.stock);
        product.stock = { idStock: Number(this.product.stock) };
      }
    }
    
    if (this.product.categorie) {
      if (typeof this.product.categorie === 'object') {
        product.categorie = this.product.categorie;
        product.idCategorie = this.product.categorie.idCategorie;
      } else {
        product.idCategorie = Number(this.product.categorie);
        
        // Trouver le nom de la catégorie à partir de l'ID
        const categorieObj = this.categories.find(cat => cat.idCategorie === Number(this.product.categorie));
        
        product.categorie = { 
          idCategorie: Number(this.product.categorie),
          nomCategorie: categorieObj ? categorieObj.nomCategorie : 'Catégorie ' + this.product.categorie
        };
      }
    }
    
    // Afficher les données qui seront envoyées pour déboggage
    console.log('Produit à mettre à jour (final):', product);
    
    // Envoyer au serveur
    this.commonService.updateProduct(product).subscribe({
      next: (response) => {
        console.log('Produit mis à jour avec succès:', response);
        this.router.navigate(['/backoffice/products']);
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour:', error);
        console.error('Détails de l\'erreur:', error.error);
        // Afficher un message plus utile à l'utilisateur
        alert('Erreur lors de la mise à jour du produit. Veuillez vérifier que tous les champs obligatoires sont remplis correctement.');
      }
    });
  }
}
