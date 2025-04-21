import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageStorageService {
  private readonly STORAGE_KEY = 'product_images';
  private readonly MAX_IMAGES = 40; 

  constructor() {}

  storeImage(fileName: string, base64String: string): string {
    try {
      let images = this.getStoredImages();

      
      while (images.size >= this.MAX_IMAGES) {
        const firstKey = images.keys().next().value;
        if (firstKey !== undefined) {
          images.delete(firstKey);
        }
      }

      images.set(fileName, base64String);

      const imageObject = Object.fromEntries(images);
      
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(imageObject));
      } catch (e) {
        if ((e as Error).name === 'QuotaExceededError') {
          const halfSize = Math.floor(images.size / 2);
          const entries = Array.from(images.entries());
          const newImages = new Map(entries.slice(halfSize));
          newImages.set(fileName, base64String);
          
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(Object.fromEntries(newImages)));
        }
      }

      return fileName;
    } catch (error) {
      console.error('Erreur lors du stockage de l\'image:', error);
      return '';
    }
  }

  getImageUrl(fileName: string): string {
    try {
      const images = this.getStoredImages();
      const base64String = images.get(fileName);
      return base64String ? `data:image/jpeg;base64,${base64String}` : '';
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'image:', error);
      return '';
    }
  }

  private getStoredImages(): Map<string, string> {
    try {
      const storedImages = localStorage.getItem(this.STORAGE_KEY);
      return new Map(Object.entries(JSON.parse(storedImages || '{}')));
    } catch {
      return new Map();
    }
  }

  clearOldImages() {
    try {
      const images = this.getStoredImages();
      if (images.size > this.MAX_IMAGES) {
        const entries = Array.from(images.entries());
        const newImages = new Map(entries.slice(-this.MAX_IMAGES));
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(Object.fromEntries(newImages)));
      }
    } catch (error) {
      console.error('Erreur lors du nettoyage des anciennes images:', error);
    }
  }
}
