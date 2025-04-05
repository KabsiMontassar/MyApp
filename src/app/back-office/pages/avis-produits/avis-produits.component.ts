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
  page: number = 1;


  constructor(private commonService: CommonService) { }

  ngOnInit() {
    this.loadAvis();
  }

  loadAvis() {
    this.commonService.getAvis().subscribe(data => {
      this.avisProduit = data;
    });
  }

  deleteAvis(id: number) {
    this.commonService.deleteAvis(id).subscribe(() => {
      this.loadAvis();
    });
  }
}