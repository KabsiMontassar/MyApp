import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError, timer } from 'rxjs';
import { catchError, timeout, retry, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PlantDiseaseDetectionService {
  
  // API base URL - typically would come from environment configuration
  private apiUrl = 'http://localhost:5000';
  
  constructor(private http: HttpClient) { }
  
  /**
   * Checks if the prediction server is running
   * @returns An observable that resolves to true if the server is running
   */
  checkServerStatus(): Observable<boolean> {
    const headers = new HttpHeaders({
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    });

    // Try to access the health endpoint
    return this.http.get<any>(`${this.apiUrl}/health`, { 
      headers
    })
    .pipe(
      timeout(3000),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 0) {
          console.error('Could not connect to prediction server. Please ensure it is running.');
        } else {
          console.error('Error checking server status:', error);
        }
        return of(false);
      }),
      // Map successful response to true
      switchMap(response => {
        if (response && response.status === 'ok') {
          console.log('Plant disease prediction server is running correctly:', response.message);
          return of(true);
        }
        console.warn('Plant disease prediction server is not healthy:', response);
        return of(false);
      })
    );
  }
  
  /**
   * Detects plant diseases from an uploaded image
   * @param imageFile The image file to analyze
   * @returns An observable with the prediction results
   */
  detectDisease(imageFile: File): Observable<any> {
    // First check if server is running
    return this.checkServerStatus().pipe(
      switchMap(isRunning => {
        if (!isRunning) {
          return throwError(() => new Error('Plant disease prediction server is not running. Please start the API server using the start_api_server.bat file.'));
        }
        
        // Check if file is valid
        if (!imageFile || !(imageFile instanceof File)) {
          console.error('Invalid file provided:', imageFile);
          return throwError(() => new Error('Invalid file provided.'));
        }
        
        console.log('Uploading image for prediction:', imageFile.name, 'Size:', imageFile.size, 'Type:', imageFile.type);
        
        // Create form data with the image file
        const formData = new FormData();
        formData.append('image', imageFile);
        
        // Make API request with better error handling
        return this.http.post<any>(`${this.apiUrl}/predict`, formData)
          .pipe(
            retry(1), // Retry once in case of temporary failure
            catchError((error: HttpErrorResponse) => {
              console.error('Plant disease prediction error:', error);
              
              if (!navigator.onLine) {
                return throwError(() => new Error('Network connection is unavailable.'));
              }
              
              if (error.status === 0) {
                return throwError(() => new Error('Plant disease prediction server is not running. Please start the server using the start_api_server.bat file.'));
              }
              
              if (error.status === 400) {
                return throwError(() => new Error(error.error?.error || 'Invalid image format. Please upload a valid image (JPG, JPEG, or PNG).'));
              }
              
              if (error.status === 500) {
                return throwError(() => new Error('Server encountered an error processing your image. Please try with a different image.'));
              }
              
              return throwError(() => new Error('Error processing the image. Please try again with a different image.'));
            })
          );
      })
    );
  }
}
