import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from 'src/app/Models/Product.Model';

@Component({
  selector: 'app-cart-modal',
  templateUrl: './cart-modal.component.html',
  styleUrls: ['./cart-modal.component.css']
})
export class CartModalComponent {
 
  @Output() closeModal = new EventEmitter<void>();
  close() {
    this.closeModal.emit();
  }
  @Input() product!: Product;
  @Input() quantity!: number;
  @Input() total!: number;

}
