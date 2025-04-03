import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Categorie } from 'src/app/Models/Categorie.Model';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-edit-categorie',
  templateUrl: './edit-categorie.component.html',
  styleUrls: ['./edit-categorie.component.css']
})
export class EditCategorieComponent  implements OnInit {
  Categorie: Categorie = new Categorie();

  constructor(
    private commonService: CommonService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.commonService.getCategoryById(+id).subscribe((data) => {
        this.Categorie = data;
      });
    }
  }

  updateCategorie() {
    this.commonService.updateCategory(this.Categorie).subscribe(() => {
      this.router.navigate(['/backoffice/categorie']);
    });
  }}