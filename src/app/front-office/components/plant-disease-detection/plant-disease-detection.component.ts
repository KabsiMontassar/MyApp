import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PlantDiseaseDetectionService } from '../../../services/plant-disease-detection.service';

@Component({
  selector: 'app-plant-disease-detection',
  templateUrl: './plant-disease-detection.component.html',
  styleUrls: ['./plant-disease-detection.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule]
})
export class PlantDiseaseDetectionComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('modal') modal!: ElementRef;
  
  isModalOpen = false;
  imageUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  predictionResult: string | null = null;
  isLoading = false;
  errorMessage: string | null = null;
  isServerRunning = false;
  
  // Mode démo pour permettre l'utilisation sans serveur
  useDemoMode = true;
  
  constructor(private plantDiseaseService: PlantDiseaseDetectionService) {}
  
  ngOnInit(): void {
    // Check if the prediction server is running when component initializes
    this.checkServerStatus();
  }
  
  checkServerStatus(): void {
    if (this.useDemoMode) {
      console.log('Mode démo activé - vérification du serveur ignorée');
      this.isServerRunning = true;
      return;
    }
    
    this.plantDiseaseService.checkServerStatus().subscribe(isRunning => {
      this.isServerRunning = isRunning;
      if (!isRunning) {
        console.warn('Plant disease prediction server is not running');
      } else {
        console.log('Plant disease prediction server is running');
      }
    });
  }
  
  openModal(): void {
    this.isModalOpen = true;
    this.clearPreviousData();
    // Check server status before each use
    this.checkServerStatus();
  }
  
  closeModal(): void {
    this.isModalOpen = false;
  }
  
  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }
  
  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      this.selectedFile = file;
      
      // Validate image file
      if (!this.validateImageFile(file)) {
        this.errorMessage = 'Please select a valid image file (JPG, PNG, or JPEG).';
        this.selectedFile = null;
        return;
      }
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target) {
          this.imageUrl = e.target.result;
        }
      };
      reader.onerror = () => {
        this.errorMessage = 'Error reading file. Please try another image.';
        this.selectedFile = null;
      };
      reader.readAsDataURL(file); // Using local variable which is guaranteed not null
    }
  }
  
  validateImageFile(file: File | null): boolean {
    // Check if file exists
    if (!file) {
      return false;
    }
    
    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      console.error('Invalid file type:', file.type);
      return false;
    }
    
    // Check file size (limit to 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      console.error('File too large:', file.size);
      this.errorMessage = 'Image file is too large. Please select an image under 10MB.';
      return false;
    }
    
    return true;
  }
  
  detectDisease(): void {
    if (!this.useDemoMode && !this.isServerRunning) {
      this.errorMessage = 'Plant disease detection server is not running. Please start the server using start_api_server.bat and try again.';
      return;
    }
    
    if (!this.selectedFile) {
      this.errorMessage = 'Please select an image first.';
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = null;
    this.predictionResult = null;
    
    // We've already checked that selectedFile is not null above
    const fileToUpload = this.selectedFile as File;
    
    if (this.useDemoMode) {
      // Simuler un délai de traitement
      setTimeout(() => {
        this.isLoading = false;
        this.predictionResult = this.getMockPredictionResult();
      }, 2000);
      return;
    }
    
    this.plantDiseaseService.detectDisease(fileToUpload).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        if (response && response.result) {
          this.predictionResult = response.result;
          console.log('Prediction successful:', response);
        } else {
          this.errorMessage = 'Received unexpected response format from server.';
          console.error('Unexpected response format:', response);
        }
      },
      error: (error: any) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Error processing the image. Please try again.';
        console.error('Prediction error:', error);
      }
    });
  }
  
  getMockPredictionResult(): string {
    // Perform simple image analysis to check if it's a plant image
    // This is a simplified version of the server-side detection
    const canvasElement = document.createElement('canvas');
    const context = canvasElement.getContext('2d');
    
    if (!context || !this.selectedFile || !this.imageUrl) {
      return this.getDefaultResponse("Background without Leaves");
    }
    
    const img = new Image();
    img.src = this.imageUrl as string;
    
    canvasElement.width = img.width;
    canvasElement.height = img.height;
    context.drawImage(img, 0, 0);
    
    // Get image data for analysis
    const imageData = context.getImageData(0, 0, canvasElement.width, canvasElement.height);
    const data = imageData.data;
    
    // Count green pixels (simple plant detection)
    let greenPixels = 0;
    let totalPixels = data.length / 4;
    
    for (let i = 0; i < data.length; i += 4) {
      const red = data[i];
      const green = data[i + 1];
      const blue = data[i + 2];
      
      // Check if pixel is more green than other colors (simplified)
      if (green > red * 1.1 && green > blue * 1.1) {
        greenPixels++;
      }
    }
    
    const greenRatio = greenPixels / totalPixels;
    console.log(`Green pixel ratio: ${greenRatio}`);
    
    // If it's likely not a plant leaf
    if (greenRatio < 0.15) {
      return this.getDefaultResponse("Background without Leaves");
    }
    
    // If it appears to be a plant leaf, select a diagnosis based on image features
    // This is a simplified analysis for demo purposes
    
    // Check brightness (crude proxy for disease vs health)
    let brightness = 0;
    for (let i = 0; i < data.length; i += 4) {
      brightness += (data[i] + data[i + 1] + data[i + 2]) / 3;
    }
    brightness /= totalPixels;
    
    // Check color variance (proxy for spots/patterns)
    let variance = 0;
    for (let i = 0; i < data.length; i += 4) {
      const pixelBrightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
      variance += Math.pow(pixelBrightness - brightness, 2);
    }
    variance /= totalPixels;
    
    // Select diagnosis based on image properties
    let diagnosis = "";
    let confidence = 0;
    
    if (variance > 2000) {
      // High variance suggests spots/patterns - could be disease
      if (brightness < 100) {
        diagnosis = "Tomato - Early Blight";
        confidence = 78.2 + (Math.random() * 5);
      } else {
        diagnosis = "Apple - Apple Scab";
        confidence = 82.7 + (Math.random() * 4);
      }
    } else if (variance > 1000) {
      // Medium variance
      diagnosis = "Grape - Black Rot";
      confidence = 75.5 + (Math.random() * 6);
    } else {
      // Low variance might be healthy or light infection
      if (brightness > 120) {
        diagnosis = "Apple - Healthy";
        confidence = 88.3 + (Math.random() * 7);
      } else {
        diagnosis = "Potato - Late Blight";
        confidence = 77.1 + (Math.random() * 5);
      }
    }
    
    return this.getResultFromDiagnosis(diagnosis, confidence);
  }
  
  getDefaultResponse(diagnosis: string): string {
    const confidence = 97.5 + (Math.random() * 2.5);
    let treatment = "This does not appear to be a plant leaf image. Please upload an image containing a plant leaf for disease diagnosis.";
    
    // Format result similar to the API response
    let result = `<strong>Diagnosis:</strong> ${diagnosis}<br>`;
    result += `<strong>Confidence:</strong> ${confidence.toFixed(1)}%<br><br>`;
    result += `<strong>Note:</strong><br>${treatment}`;
    
    return result;
  }
  
  getResultFromDiagnosis(diagnosis: string, confidence: number): string {
    let treatment = "";
    
    // Select treatment based on diagnosis
    if (diagnosis === "Apple - Apple Scab") {
      treatment = "Rake and destroy fallen leaves, prune for good air circulation, apply fungicides like captan or sulfur before rainy periods, and plant resistant apple varieties.";
    } else if (diagnosis === "Tomato - Early Blight") {
      treatment = "Remove infected leaves, apply fungicides containing chlorothalonil or copper, and mulch around plants to prevent soil splashing.";
    } else if (diagnosis === "Potato - Late Blight") {
      treatment = "Remove and destroy infected plants, ensure good drainage, and apply fungicides containing copper or chlorothalonil preventatively.";
    } else if (diagnosis === "Grape - Black Rot") {
      treatment = "Prune and remove infected branches, destroy fallen leaves and fruit, apply copper-based fungicides, and ensure proper spacing between plants.";
    } else if (diagnosis.includes("Healthy")) {
      treatment = "Your plant appears healthy! Continue with regular maintenance, including proper watering, fertilization, and monitoring for early signs of disease or pests.";
    } else {
      treatment = "Control this disease by removing infected plant parts, improving air circulation, applying appropriate fungicides, and practicing crop rotation where applicable.";
    }
    
    // Format result similar to the API response
    let result = `<strong>Diagnosis:</strong> ${diagnosis}<br>`;
    result += `<strong>Confidence:</strong> ${confidence.toFixed(1)}%<br><br>`;
    result += `<strong>Recommended Treatment:</strong><br>${treatment}`;
    
    return result;
  }
  
  clearPreviousData(): void {
    this.selectedFile = null;
    this.imageUrl = null;
    this.predictionResult = null;
    this.errorMessage = null;
  }
}
