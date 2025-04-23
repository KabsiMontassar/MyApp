import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageStorageService {
  // Clé unique pour stocker toutes les images dans le localStorage
  private readonly STORAGE_KEY = 'product_images';

  constructor() {}

  // Point 1: Stockage d'une image
  storeImage(fileName: string, base64String: string): string {
    try {
      // Récupère la Map des images existantes
      let images = this.getStoredImages();
      // Ajoute ou met à jour l'image
      images.set(fileName, base64String);
      // Convertit la Map en objet et sauvegarde dans localStorage
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(Object.fromEntries(images)));
      return fileName;
    } catch (error) {
      console.error('Erreur lors du stockage de l\'image:', error);
      return '';
    }
  }

  // Point 2: Récupération d'une image
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

  // Point 3: Gestion interne des données
  private getStoredImages(): Map<string, string> {
    try {
      const storedImages = localStorage.getItem(this.STORAGE_KEY);
      return new Map(Object.entries(JSON.parse(storedImages || '{}')));
    } catch {
      return new Map();
    }
  }
}
