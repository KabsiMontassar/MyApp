import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Order, OrderProduct } from 'src/app/Models/Order.Model';
import { OrderService } from 'src/app/services/order.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Product } from 'src/app/Models/Product.Model';

@Component({
  selector: 'app-commandes',
  templateUrl: './commandes.component.html',
  styleUrls: ['./commandes.component.css']
})
export class CommandesComponent {

  orders: Order[] = [];
  @ViewChild('cartModal') cartModal!: TemplateRef<any>; 
  

  constructor(
    private orderService: OrderService,
    // private toastr: ToastrService,
    private modalService: NgbModal
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
      // this.toastr.success('Order deleted successfully','Succès'); // Reload the list of orders after deletion
    });
    
  }
  showModal = false;
  orderproducts!: OrderProduct[];
    openModal(content: any,order:Order) {
      this.orderproducts=order.orderProducts
      console.log(this.orderproducts);
      this.modalService.open(content, { 
          centered: true,
          backdrop: false, // Empêche la fermeture en cliquant à l'extérieur
          keyboard: false // Empêche la fermeture avec ESC
      
      });}
}
