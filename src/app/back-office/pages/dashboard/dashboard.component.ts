import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { Subscription, interval } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  deletedProducts: any[] = [];
  lastDeletedUpdate: Date = new Date();
  private deleteSubscription?: Subscription;
  
  // Nouvelles propriétés
  totalProducts: number = 0;
  totalAvis: number = 0;
  productChart: any;
  newUsersToday: number = 0;
  totalUsers: number = 0;
  constructor(private commonService: CommonService) {}
  ngOnInit() {
    this.deleteSubscription = interval(10000)
      .pipe(
        startWith(0),
        switchMap(() => this.commonService.getDeletedOutOfStockProducts())
      )
      .subscribe({
        next: (data) => {
          this.deletedProducts = data;
          this.lastDeletedUpdate = new Date();
        },
        error: (error) => {
          console.error('Erreur:', error);
        }
      });

    this.loadStatistics();
  }

  private loadStatistics() {
    this.commonService.getProducts().subscribe({
      next: (products) => {
        this.totalProducts = products.length;
      },
      error: (error) => console.error('Erreur produits:', error)
    });

    this.commonService.getAvis().subscribe({
      next: (avis) => {
        this.totalAvis = avis.length;
        this.processAvisData(avis);
      },
      error: (error) => console.error('Erreur avis:', error)
    });
  }

  private processAvisData(avis: any[]) {
    const avisByProduct = avis.reduce((acc, curr) => {
      if (!curr.produit) return acc;
      const produitNom = curr.produit.nom;
      acc[produitNom] = (acc[produitNom] || 0) + 1;
      return acc;
    }, {});

    const labels = Object.keys(avisByProduct);
    const data = Object.values(avisByProduct) as number[];

    this.createProductChart(labels, data);
  }

  private createProductChart(labels: string[], data: number[]) {
    const ctx = document.getElementById('productReviewChart') as HTMLCanvasElement;
    if (this.productChart) {
      this.productChart.destroy();
    }
    
    this.productChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: "Nombre d'avis",
          data: data,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.deleteSubscription) {
      this.deleteSubscription.unsubscribe();
    }
    if (this.productChart) {
      this.productChart.destroy();
    }
  }
}