import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { Stock } from 'src/app/Models/Stock.Model';


@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css']
})
export class StocksComponent implements OnInit {
  stocks: Stock[] = [];
  filteredStocks: Stock[] = [];
  searchTerm: string = '';
  page: number = 1;


  constructor(private commonService: CommonService) { }

  ngOnInit() {
    this.loadStocks();
  }

  loadStocks() {
    this.commonService.getStocks().subscribe(data => {
      this.stocks = data;
      this.filteredStocks = data;
    });
  }

  deleteStocks(id: number) {
    this.commonService.deleteStock(id).subscribe(() => {
      this.loadStocks();
    });
  }

  searchStocks() {
    this.filteredStocks = this.stocks.filter(stock => 
      stock.nom.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.page = 1;
  }
}
