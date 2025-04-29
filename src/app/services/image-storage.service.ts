import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageStorageService {
  private readonly STORAGE_KEY_PREFIX = 'product_image_';
  private imageCache = new Map<string, string>(); // Cache mémoire pour les images

  constructor() {
    // Précharger les images du sessionStorage dans le cache mémoire au démarrage
    this.preloadImages();
  }

  // Préchargement des images du sessionStorage dans le cache mémoire
  private preloadImages(): void {
    console.log('🔄 Démarrage du préchargement des images...');
    try {
      // Essayer d'abord de récupérer depuis sessionStorage (plus rapide)
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && key.startsWith(this.STORAGE_KEY_PREFIX)) {
          const fileName = key.substring(this.STORAGE_KEY_PREFIX.length);
          const value = sessionStorage.getItem(key);
          if (value) {
            this.imageCache.set(fileName, value);
            console.log('✅ Image préchargée depuis sessionStorage:', fileName);
          }
        }
      }
      
      // Ensuite essayer de récupérer depuis localStorage (plus persistant)
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.STORAGE_KEY_PREFIX)) {
          const fileName = key.substring(this.STORAGE_KEY_PREFIX.length);
          // Ne charger que si pas déjà en cache
          if (!this.imageCache.has(fileName)) {
            const value = localStorage.getItem(key);
            if (value) {
              this.imageCache.set(fileName, value);
              // Copier également dans sessionStorage pour accès plus rapide
              sessionStorage.setItem(key, value);
              console.log('✅ Image préchargée depuis localStorage:', fileName);
            }
          }
        }
      }
      
      console.log(`🎉 Préchargement terminé: ${this.imageCache.size} images en cache`);
      
      // Si nous sommes dans le front-office, forcer un préchargement spécifique
      if (window.location.href.includes('/frontoffice/')) {
        console.log('🔍 Détecté front-office, préchargement supplémentaire');
        this.ensureFrontOfficeImages();
      }
    } catch (error) {
      console.error('❌ Erreur de préchargement des images:', error);
    }
  }
  
  // Fonction spéciale pour assurer le chargement d'images dans le front-office
  private ensureFrontOfficeImages(): void {
    // Parcourir localStorage et sessionStorage pour trouver tous les noms d'images
    const allImageNames = new Set<string>();
    
    // Collecter tous les noms d'images depuis localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.STORAGE_KEY_PREFIX)) {
        allImageNames.add(key.substring(this.STORAGE_KEY_PREFIX.length));
      }
    }
    
    // Collecter tous les noms d'images depuis sessionStorage
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith(this.STORAGE_KEY_PREFIX)) {
        allImageNames.add(key.substring(this.STORAGE_KEY_PREFIX.length));
      }
    }
    
    console.log(`🔍 Front-office: ${allImageNames.size} images trouvées pour préchargement`);
    
    // Pour chaque nom d'image, s'assurer qu'il est chargé correctement
    allImageNames.forEach(fileName => {
      // Tenter de récupérer l'image
      const imageUrl = this.getImageUrl(fileName);
      
      // Précharger l'image
      if (imageUrl && imageUrl.startsWith('data:')) {
        const img = new Image();
        img.src = imageUrl;
        console.log(`🔄 Front-office: Préchargement de l'image ${fileName}`);
      }
    });
  }
  
  storeImage(fileName: string, base64String: string): string {
    try {
      // Vérifier la taille de l'image
      const imageSize = new Blob([base64String]).size;
      console.log(`Stockage de l'image ${fileName}, taille:`, this.formatBytes(imageSize));
      
      // Réduire le nom de fichier si nécessaire
      const safeFileName = fileName.length > 100 ? fileName.substring(0, 100) : fileName;
      
      // 1. Stocker dans le cache mémoire pour l'accès le plus rapide
      this.imageCache.set(safeFileName, base64String);
      
      const storageKey = `${this.STORAGE_KEY_PREFIX}${safeFileName}`;
      
      // 2. Stocker d'abord dans sessionStorage (pour cette session)
      sessionStorage.setItem(storageKey, base64String);
      
      // 3. Puis tenter de stocker dans localStorage (persistant)
      try {
        localStorage.setItem(storageKey, base64String);
        console.log(`Image ${safeFileName} stockée avec succès (session + local)`);
      } catch (localStorageError) {
        console.warn('Échec du stockage dans localStorage, mais disponible en session:', localStorageError);
      }
      
      return safeFileName;
    } catch (error) {
      console.error('Erreur lors du stockage de l\'image:', error);
      // Même en cas d'erreur, on renvoie le nom du fichier
      return fileName;
    }
  }

  getImageUrl(fileName: string): string {
    // Protection contre les valeurs nulles/vides
    if (!fileName || typeof fileName !== 'string' || fileName.trim() === '') {
      console.warn('🚫 Nom de fichier invalide ou vide');
      return this.getFallbackImageUrl();
    }

    try {
      // Si déjà une URL complète ou data URL, la retourner telle quelle
      if (fileName.startsWith('http') || fileName.startsWith('data:')) {
        console.log('✅ URL déjà complète:', fileName.substring(0, 30) + '...');
        return fileName;
      }
      
      // NOUVELLE APPROCHE DIRECTE: Vérifier d'abord dans le cache global window
      // @ts-ignore
      if (window.appImageCache && window.appImageCache[fileName]) {
        // @ts-ignore
        const directUrl = window.appImageCache[fileName];
        console.log('✅ Image récupérée depuis le cache global (window):', fileName);
        return directUrl;
      }
      
      // NOUVELLE APPROCHE DIRECTE: Vérifier directement dans localStorage avec le préfixe 'direct_image_'
      const directImageKey = `direct_image_${fileName}`;
      const directImage = localStorage.getItem(directImageKey);
      if (directImage && directImage.startsWith('data:')) {
        console.log('✅ Image récupérée depuis localStorage direct:', fileName);
        
        // Ajouter au cache global pour les prochains accès
        // @ts-ignore
        if (!window.appImageCache) {
          // @ts-ignore
          window.appImageCache = {};
        }
        // @ts-ignore
        window.appImageCache[fileName] = directImage;
        
        return directImage;
      }
      
      // Essayer les mécanismes de stockage standard dans l'ordre (du plus rapide au plus lent)
      
      // 1. D'abord vérifier le cache mémoire
      let base64Data = this.imageCache.get(fileName);
      
      // 2. Si pas en cache mémoire, essayer sessionStorage
      if (!base64Data) {
        const sessionStorageKey = `${this.STORAGE_KEY_PREFIX}${fileName}`;
        const sessionValue = sessionStorage.getItem(sessionStorageKey);
        if (sessionValue) {
          base64Data = sessionValue;
          // Mettre en cache pour les accès ultérieurs
          this.imageCache.set(fileName, sessionValue);
          console.log(`✅ Image ${fileName} récupérée de sessionStorage`);
        }
      }
      
      // 3. Si toujours pas trouvé, essayer localStorage
      if (!base64Data) {
        const localStorageKey = `${this.STORAGE_KEY_PREFIX}${fileName}`;
        const localValue = localStorage.getItem(localStorageKey);
        if (localValue) {
          base64Data = localValue;
          // Mettre en cache pour les accès ultérieurs
          this.imageCache.set(fileName, localValue);
          // Copier dans sessionStorage pour la prochaine fois
          sessionStorage.setItem(localStorageKey, localValue);
          console.log(`✅ Image ${fileName} récupérée de localStorage`);
        }
      }
      
      // Si l'image a été trouvée dans un des stockages
      if (base64Data) {
        // Vérification minimale de validité
        if (!base64Data || base64Data.trim() === '') {
          console.error('Données base64 vides ou invalides');
          return this.getFallbackImageUrl();
        }
        
        // Déjà une data URL?
        if (base64Data.startsWith('data:')) {
          return base64Data;
        }
        
        // Détecter le type MIME en fonction des premiers caractères
        let mimeType = 'image/jpeg'; // Par défaut
        
        // Quelques signatures base64 courantes
        if (base64Data.startsWith('/9j/')) {
          mimeType = 'image/jpeg';
        } else if (base64Data.startsWith('iVBORw0KGg')) {
          mimeType = 'image/png';
        } else if (base64Data.startsWith('UklGRk')) {
          mimeType = 'image/webp';
        } else if (base64Data.startsWith('R0lGOD')) {
          mimeType = 'image/gif';
        } else if (base64Data.startsWith('Qk')) {
          mimeType = 'image/bmp';
        }
        
        return `data:${mimeType};base64,${base64Data}`;
      }
      
      // Si on arrive ici, l'image n'est pas en mémoire
      console.warn(`Image non trouvée en mémoire: ${fileName}, essai avec les assets`);
      
      // Essayer de trouve l'image dans les assets si c'est un nom simple
      if (!fileName.includes('/')) {
        const assetPath = `assets/images/${fileName}`;
        console.log('Tentative avec le chemin assets:', assetPath);
        return assetPath;
      } else if (fileName.includes('assets/')) {
        // C'est déjà un chemin assets, le retourner tel quel
        return fileName;
      }
      
      // Dernier recours: retourner le nom tel quel
      console.warn('Utilisation du nom de fichier tel quel:', fileName);
      return fileName;
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'image ${fileName}:`, error);
      return this.getFallbackImageUrl();
    }
  }

  // Utilitaire pour formater les octets en unités lisibles
  private formatBytes(bytes: number, decimals: number = 2): string {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
  }

  // Vider les caches
  clearCaches(): void {
    try {
      this.imageCache.clear();
      
      // Supprimer les entrées du sessionStorage
      const sessionKeys = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && key.startsWith(this.STORAGE_KEY_PREFIX)) {
          sessionKeys.push(key);
        }
      }
      sessionKeys.forEach(key => sessionStorage.removeItem(key));
      
      // Supprimer les entrées du localStorage
      const localKeys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.STORAGE_KEY_PREFIX)) {
          localKeys.push(key);
        }
      }
      localKeys.forEach(key => localStorage.removeItem(key));
      
      console.log(`Caches nettoyés: ${sessionKeys.length} entrées sessionStorage, ${localKeys.length} entrées localStorage`);
    } catch (error) {
      console.error('Erreur lors du nettoyage des caches:', error);
    }
  }

  // Image par défaut en cas d'erreur
  private getFallbackImageUrl(): string {
    return 'assets/images/product-1.jpg';
  }
}
