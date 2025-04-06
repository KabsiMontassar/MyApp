import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Categorie } from 'src/app/Models/Categorie.Model';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-add-categorie',
  templateUrl: './add-categorie.component.html',
  styleUrls: ['./add-categorie.component.css']
})
export class AddCategorieComponent {
newCategorie: Categorie = new Categorie();  
  selectedFile: File | null = null;

  constructor(private commonService: CommonService, private router: Router) {}

  
  addCategory() {
    this.commonService.addCategory(this.newCategorie).subscribe(() => {
      this.router.navigate(['/backoffice/categorie']);
    });
  }
  
}

