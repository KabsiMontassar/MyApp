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
    this.commonService.getStocks().subscribe(stocks => {
      this.commonService.getProducts().subscribe(products => {
        this.stocks = stocks.map(stock => {
          const stockProducts = products.filter(p => p.stock?.idStock === stock.idStock);
          const totalQuantity = stockProducts.reduce(
            (sum, product) => sum + (product.quantiteDisponible || 0),
            0
          );
          
          const updatedStock = {
            ...stock,
            quantite: totalQuantity,
            dateMaj: new Date()
          };

          this.commonService.updateStock(updatedStock).subscribe();
          
          return updatedStock;
        });
        
        this.filteredStocks = this.stocks;
      });
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
