import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Stock } from 'src/app/Models/Stock.Model';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-add-stock',
  templateUrl: './add-stock.component.html',
  styleUrls: ['./add-stock.component.css']
})
export class AddStockComponent {
  newStock: Stock = new Stock();  
  selectedFile: File | null = null;

  constructor(private commonService: CommonService, private router: Router) {}

  
  addStock() {
  
    this.commonService.addStock(this.newStock).subscribe(() => {
      this.router.navigate(['/backoffice/stocks']);
    });
  }
  
}
