import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../Models/Product.Model';
import { AvisProduit } from '../Models/AvisProduit.Model';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private produitsUrl = 'http://localhost:8081/produits';
  private stockUrl = 'http://localhost:8081/stocks';
  private categorieUrl = 'http://localhost:8081/categories';
  private avisUrl = 'http://localhost:8081/avis';

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.produitsUrl}/retrieve-all-Produits`);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.produitsUrl}/retrieve-Produits/${id}`);
  }

  addProduct(product: Product): Observable<Product> {
    // Assurons-nous que tous les champs sont présents
    const productToSend = {
      ...product,
      conseilsCulture: product.conseilsCulture || ''
    };
    return this.http.post<Product>(`${this.produitsUrl}/add-Produits`, productToSend);
  }

  updateProduct(product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.produitsUrl}/update`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.produitsUrl}/delete/${id}`);
  }

  getStocks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.stockUrl}/all`);
  }

  addStock(stock: any): Observable<any> {
    return this.http.post<any>(`${this.stockUrl}/add`, stock);
  }

  updateStock(stock: any): Observable<any> {
    return this.http.put<any>(`${this.stockUrl}/update`, stock);
  }

  deleteStock(id: number): Observable<void> {
    return this.http.delete<void>(`${this.stockUrl}/delete/${id}`);
  }

  getStockById(id: number): Observable<any> {
    return this.http.get<any>(`${this.stockUrl}/${id}`);
  }

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.categorieUrl}/all`);
  }

  addCategory(category: any): Observable<any> {
    return this.http.post<any>(`${this.categorieUrl}/add`, category);
  }

  updateCategory(category: any): Observable<any> {
    return this.http.put<any>(`${this.categorieUrl}/update`, category);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.categorieUrl}/delete/${id}`);
  }

  getCategoryById(id: number): Observable<any> {
    return this.http.get<any>(`${this.categorieUrl}/${id}`);
  }

  getAvis(): Observable<any[]> {
    return this.http.get<any[]>(`${this.avisUrl}/all`);
  }

  addAvis(avis: any): Observable<any> {
    return this.http.post<AvisProduit>(`${this.avisUrl}/add`, avis);
  }

  updateAvis(avis: any): Observable<any> {
    return this.http.put<any>(`${this.avisUrl}/update`, avis);
  }

  deleteAvis(id: number): Observable<void> {
    return this.http.delete<void>(`${this.avisUrl}/delete/${id}`);
  }

  getDeletedOutOfStockProducts(): Observable<any> {
    return this.http.get<any>(`${this.produitsUrl}/deleted-out-of-stock`);
  }

  
}