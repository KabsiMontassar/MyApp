import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Order, OrderProduct } from 'src/app/Models/Order.Model';
import { OrderService } from 'src/app/services/order.service';
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
    private toastr: ToastrService
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
      this.loadOrders(); // Reload the list of orders after update
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