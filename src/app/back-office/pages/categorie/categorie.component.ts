import { Component, OnInit } from '@angular/core';
import { Categorie } from 'src/app/Models/Categorie.Model';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-categorie',
  templateUrl: './categorie.component.html',
  styleUrls: ['./categorie.component.css']
})
export class CategorieComponent implements OnInit {
  categories: Categorie[] = [];
  filteredCategories: Categorie[] = [];
  searchTerm: string = '';
  page: number = 1;

  constructor(private commonService: CommonService) { }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.commonService.getCategories().subscribe(data => {
      this.categories = data;
      this.filteredCategories = data;
    });
  }

  deleteCategory(id: number) {
    this.commonService.deleteCategory(id).subscribe(() => {
      this.loadCategories();
    });
  }

  searchCategories() {
    this.filteredCategories = this.categories.filter(categorie => 
      categorie.nomCategorie.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.page = 1;
  }
}
