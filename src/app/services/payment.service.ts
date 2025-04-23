// payment.service.ts
import { Injectable } from '@angular/core';
import { loadStripe, Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';
import { HttpClient } from '@angular/common/http';
import { environment } from '../front-office/components/checkout/payment/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private stripePromise: Promise<Stripe | null>;
  private elements: StripeElements | undefined;
  private card: StripeCardElement | undefined;

  constructor(private http: HttpClient) {
    this.stripePromise = loadStripe(environment.stripePublishableKey);
  }

  async initializeCardElement(elementId: string): Promise<void> {
    const stripe = await this.stripePromise;
    if (!stripe) throw new Error('Stripe failed to initialize');

    const elements = stripe.elements();
    this.card = elements.create('card');
    this.card.mount(`#${elementId}`);
  }

  async createPaymentIntent(orderId: number): Promise<{ clientSecret: string; paymentIntentId: string }> {
    const response = await this.http.post<any>(
      'http://localhost:8081/api/payment/create-intent',
      { orderId },
      { responseType: 'json' }
    ).toPromise();
    return response!;
  }
  
  async confirmPayment(clientSecret: string): Promise<any> {
    const stripe = await this.stripePromise;
    if (!stripe || !this.card) throw new Error('Stripe not initialized');
  
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: this.card }
    });
  
    if (error) throw error;
    return paymentIntent;
  }
  
  async updatePaymentStatus(paymentIntentId: string, status: string): Promise<void> {
    await this.http.post(
      'http://localhost:8081/api/payment/update-status',
      { paymentIntentId, status }
    ).toPromise();
  }
  
}