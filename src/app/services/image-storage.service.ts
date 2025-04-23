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
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(Object.fromEntries(images)));
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
}
