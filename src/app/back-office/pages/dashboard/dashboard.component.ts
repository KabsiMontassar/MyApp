import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { Subscription, interval } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  deletedProducts: any[] = [];
  lastDeletedUpdate: Date = new Date();
  private deleteSubscription?: Subscription;

  constructor(private commonService: CommonService) {}

  ngOnInit() {
    // Check every 10 seconds
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
          console.error('Erreur lors de la récupération des produits supprimés:', error);
        }
      });
  }

  ngOnDestroy() {
    if (this.deleteSubscription) {
      this.deleteSubscription.unsubscribe();
    }
  }
}