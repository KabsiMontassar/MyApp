import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageStorageService {
  private readonly IMAGE_STORAGE_KEY = 'product_images';

  constructor() {
    this.initStorage();
  }

  private initStorage() {
    if (!localStorage.getItem(this.IMAGE_STORAGE_KEY)) {
      localStorage.setItem(this.IMAGE_STORAGE_KEY, JSON.stringify({}));
    }
  }

  storeImage(fileName: string, base64Data: string): string {
    const images = JSON.parse(localStorage.getItem(this.IMAGE_STORAGE_KEY) || '{}');
    const imageUrl = `data:image;base64,${base64Data}`;
    images[fileName] = imageUrl;
    localStorage.setItem(this.IMAGE_STORAGE_KEY, JSON.stringify(images));
    return fileName;
  }

  getImageUrl(fileName: string): string {
    const images = JSON.parse(localStorage.getItem(this.IMAGE_STORAGE_KEY) || '{}');
    return images[fileName] || '';
  }
}
