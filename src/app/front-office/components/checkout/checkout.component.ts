import { Component } from '@angular/core';
import { AddressStepComponent } from './address-step/address-step.component';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  step = 1;
  orderId!: number;

  nextStep() {
    if (this.step < 4) this.step++;
  }
  
  prevStep() {
    if (this.step > 1) this.step--;
  }
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.orderId = +id;
        console.log('Received Order ID:', this.orderId);
        // You can now use this.orderId to fetch the order or continue the checkout process
      }
    });
  }
}
