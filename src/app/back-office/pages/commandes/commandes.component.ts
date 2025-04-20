import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Order, OrderProduct } from 'src/app/Models/Order.Model';
import { OrderService } from 'src/app/services/order.service';
import { CommonService } from 'src/app/services/common.service';
declare var bootstrap: any;

@Component({
  selector: 'app-commandes',
  templateUrl: './commandes.component.html',
  styleUrls: ['./commandes.component.css']
})
export class CommandesComponent implements OnInit {

  orders: Order[] = [];
  orderproducts!: OrderProduct[];
  private modal: any;

  constructor(
    private orderService: OrderService,
    private toastr: ToastrService,
    private commonService: CommonService
  ) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getAllOrders().subscribe(orders => {
      this.orders = orders;
    });
  }

  onUpdateOrder(id: number, order: Order): void {
    this.orderService.updateOrder(id, order).subscribe(() => {
      if (order.status === 'COMPLETED') {
        order.orderProducts.forEach(orderProduct => {
          // 1. Mettre à jour la quantité du produit
          const updatedProduct = { ...orderProduct.product };
          updatedProduct.quantiteDisponible -= orderProduct.quantity;
          
          // 2. Mettre à jour le produit
          this.commonService.updateProduct(updatedProduct).subscribe(() => {
            if (updatedProduct.stock?.idStock) {
              // 3. Récupérer le stock actuel
              this.commonService.getStockById(updatedProduct.stock.idStock).subscribe(currentStock => {
                // 4. Mettre à jour le stock directement avec la quantité commandée
                const stockToUpdate = {
                  ...currentStock,
                  quantite: Math.max(0, currentStock.quantite - orderProduct.quantity),
                  dateMaj: new Date()
                };
                
                // 5. Sauvegarder le stock mis à jour
                this.commonService.updateStock(stockToUpdate).subscribe(
                  () => {
                    this.toastr.success(`Stock ${stockToUpdate.nom} mis à jour`);
                  },
                  error => this.toastr.error(`Erreur de mise à jour du stock`)
                );
              });
            }
          });
        });
      }
      this.loadOrders();
    });
  }

  onDeleteOrder(id: number): void {
    this.orderService.deleteOrder(id).subscribe(() => {
      this.loadOrders();
      this.toastr.success('Order deleted successfully','Succès'); // Reload the list of orders after deletion
    });
  }

  openModal(order: Order) {
    this.orderproducts = order.orderProducts;
    this.modal = new bootstrap.Modal(document.getElementById('detailsModal'));
    this.modal.show();
  }

  closeModal() {
    if (this.modal) {
      this.modal.hide();
    }
  }
}