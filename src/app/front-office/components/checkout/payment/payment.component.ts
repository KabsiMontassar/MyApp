// payment.component.ts
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PaymentService } from 'src/app/services/payment.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.css']
})
export class PaymentComponent implements OnInit {
  @Input() orderId!: number;
  @Output() next = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();
  isLoading = false;

  constructor(
    private paymentService: PaymentService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.paymentService.initializeCardElement('card-element');
  }

  async handlePayment() {
    this.isLoading = true;
    try {
      const { clientSecret, paymentIntentId } = await this.paymentService.createPaymentIntent(this.orderId);
      const paymentIntent = await this.paymentService.confirmPayment(clientSecret);

      await this.paymentService.updatePaymentStatus(paymentIntentId, paymentIntent.status.toUpperCase());

      if (paymentIntent.status === 'succeeded') {
        this.toastr.success('Paiement effectué avec succès!', 'Succès');
        // Naviguer vers la prochaine étape
        this.next.emit();
      } else {
        this.toastr.error('Le paiement n\'a pas pu être complété', 'Erreur');
      }
    } catch (error) {
      console.error('Payment error:', error);
      this.toastr.error('Une erreur est survenue lors du paiement', 'Erreur');
    } finally {
      this.isLoading = false;
    }
  }
}
