import { Component, Input } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent {
  @Input() orderId!: number;
  isLoading = false;

  constructor(private orderService: OrderService) {}

  downloadInvoice() {
    this.isLoading = true;
    this.orderService.downloadInvoice(this.orderId).subscribe(
      (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `facture-${this.orderId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        this.isLoading = false;
      },
      error => {
        console.error('Erreur lors du téléchargement:', error);
        this.isLoading = false;
      }
    );
  }
}