import { Component, OnInit } from '@angular/core';
import { AvisProduit } from 'src/app/Models/AvisProduit.Model';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-avis-produits',
  templateUrl: './avis-produits.component.html',
  styleUrls: ['./avis-produits.component.css']
})
export class AvisProduitsComponent implements OnInit {
  avisProduit: AvisProduit[] = [];
  filteredAvis: AvisProduit[] = [];
  page: number = 1;
  searchDate: string = '';

  constructor(private commonService: CommonService) { }

  ngOnInit() {
    this.loadAvis();
  }

  loadAvis() {
    this.commonService.getAvis().subscribe(data => {
      this.avisProduit = data;
      this.filteredAvis = data;
    });
  }

  deleteAvis(id: number) {
    this.commonService.deleteAvis(id).subscribe(() => {
      this.loadAvis();
    });
  }

  filterByDate() {
    if (!this.searchDate) {
      this.filteredAvis = this.avisProduit;
      return;
    }

    this.filteredAvis = this.avisProduit.filter(avis => {
      if (!avis.dateAvis) return false;
      
      const avisDate = new Date(avis.dateAvis).toLocaleDateString();
      const searchDate = new Date(this.searchDate).toLocaleDateString();
      
      return avisDate === searchDate;
    });
    this.page = 1;
  }
}