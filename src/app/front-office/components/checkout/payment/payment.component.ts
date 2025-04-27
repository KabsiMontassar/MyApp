// payment.component.ts
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { PaymentService } from 'src/app/services/payment.service';

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

  constructor(private paymentService: PaymentService) {}

  async ngOnInit() {
    await this.paymentService.initializeCardElement('card-element');
  }

  async handlePayment() {
    this.isLoading = true;
    try {
      const { clientSecret, paymentIntentId } = await this.paymentService.createPaymentIntent(this.orderId);
      const paymentIntent = await this.paymentService.confirmPayment(clientSecret);

      await this.paymentService.updatePaymentStatus(paymentIntentId, paymentIntent.status.toUpperCase());

      console.log('Payment result:', paymentIntent);
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      this.isLoading = false;
    }
  }
}
