import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageStorageService {
  private readonly STORAGE_KEY = 'product_images';

  constructor() {}

  storeImage(fileName: string, base64String: string): string {
    try {
      let images = this.getStoredImages();
      images.set(fileName, base64String);
      const imageData = Object.fromEntries(images);
      console.log('Storing image:', fileName, 'Images size:', images.size);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(imageData));
      // Vérification immédiate
      const stored = localStorage.getItem(this.STORAGE_KEY);
      console.log('Stored successfully:', !!stored);
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
      console.log('Getting image:', fileName, 'Found:', !!base64String);
      if (!base64String) {
        console.warn('Image non trouvée:', fileName);
        return '';
      }
      // Vérifier si la chaîne base64 est valide
      if (!base64String.match(/^[A-Za-z0-9+/=]+$/)) {
        console.error('Format base64 invalide pour:', fileName);
        return '';
      }
      return `data:image/jpeg;base64,${base64String}`;
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
}