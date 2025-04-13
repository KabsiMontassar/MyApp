// payment.component.ts
import { Component, OnInit } from '@angular/core';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.css']
})
export class PaymentComponent implements OnInit {
  amount = 1000; // Amount in cents ($10.00)
  isLoading = false;

  constructor(private paymentService: PaymentService) {}

  async ngOnInit() {
    await this.paymentService.initializeCardElement('card-element');
  }

  async handlePayment() {
    this.isLoading = true;
    try {
      const clientSecret = await this.paymentService.createPaymentIntent(this.amount);
      const paymentIntent = await this.paymentService.confirmPayment(clientSecret);
      console.log('Payment successful:', paymentIntent);
      // Handle successful payment
    } catch (error) {
      console.error('Payment failed:', error);
      // Handle error
    } finally {
      this.isLoading = false;
    }
  }
}