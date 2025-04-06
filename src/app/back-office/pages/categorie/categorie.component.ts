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
  page: number = 1;


  constructor(private commonService: CommonService) { }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.commonService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  deleteCategory(id: number) {
    this.commonService.deleteCategory(id).subscribe(() => {
      this.loadCategories();
    });
  }
}
