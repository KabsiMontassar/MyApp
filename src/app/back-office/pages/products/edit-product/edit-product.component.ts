import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { Product } from 'src/app/Models/Product.Model';


@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  product: any = {};  // ou new Product(), si le modèle est bien défini
  stocks: any[] = [];
  categories: any[] = [];
  selectedFile: File | null = null;

  constructor(
    private commonService: CommonService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.commonService.getProductById(+id).subscribe((data) => {
        this.product = data;
      });
    }

    // Charger les listes de sélection
    this.commonService.getStocks().subscribe(data => {
      this.stocks = data;
    });

    this.commonService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  updateProduct() {
    // Si une image est sélectionnée, on met à jour l'URL de l'image.
    if (this.selectedFile) {
      // Ici, vous mettez l'URL de l'image après l'avoir téléchargée manuellement
      // ou après avoir l'uploadé ailleurs. Par exemple :
      this.product.imageURL = 'URL_DE_L_IMAGE_SUR_VOTRE_SERVEUR';
    }
    
    this.commonService.updateProduct(this.product).subscribe(() => {
      this.router.navigate(['/backoffice/products']);
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      // Optionnellement, vous pouvez afficher une prévisualisation de l'image.
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.product.imageURL = e.target.result;  // Affiche une prévisualisation
      };
      reader.readAsDataURL(file);  // Prévisualisation du fichier local
    }
  }
}
  
  

