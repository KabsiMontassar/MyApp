import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.produitsUrl}/retrieve-all-Produits`);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.produitsUrl}/retrieve-Produits/${id}`);
  }

  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.produitsUrl}/add-Produits`, product, this.httpOptions);
  }

  updateProduct(product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.produitsUrl}/update`, product, this.httpOptions);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.produitsUrl}/delete/${id}`);
  }

  getStocks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.stockUrl}/all`);
  }

  addStock(stock: any): Observable<any> {
    return this.http.post<any>(`${this.stockUrl}/add`, stock, this.httpOptions);
  }

  updateStock(stock: any): Observable<any> {
    return this.http.put<any>(`${this.stockUrl}/update`, stock, this.httpOptions);
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
    return this.http.post<any>(`${this.categorieUrl}/add`, category, this.httpOptions);
  }

  updateCategory(category: any): Observable<any> {
    return this.http.put<any>(`${this.categorieUrl}/update`, category, this.httpOptions);
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

  addAvis(avis: AvisProduit): Observable<AvisProduit> {
    return this.http.post<AvisProduit>(`${this.avisUrl}/add`, avis, this.httpOptions);
  }

  updateAvis(avis: any): Observable<any> {
    return this.http.put<any>(`${this.avisUrl}/update`, avis, this.httpOptions);
  }

  deleteAvis(id: number): Observable<void> {
    return this.http.delete<void>(`${this.avisUrl}/delete/${id}`);
  }
}