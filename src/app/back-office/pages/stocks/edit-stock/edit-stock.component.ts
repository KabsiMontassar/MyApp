import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Stock } from 'src/app/Models/Stock.Model';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-edit-stock',
  templateUrl: './edit-stock.component.html',
  styleUrls: ['./edit-stock.component.css']
})
export class EditStockComponent implements OnInit {
  stock: Stock = new Stock();

  constructor(
    private commonService: CommonService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.commonService.getStockById(+id).subscribe((data) => {
        this.stock = data;
      });
    }
  }

  updateStock() {
    this.commonService.updateStock(this.stock).subscribe(() => {
      this.router.navigate(['/backoffice/stocks']);
    });
  }
  
}